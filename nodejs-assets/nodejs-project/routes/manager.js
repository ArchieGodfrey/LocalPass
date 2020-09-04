const express = require('express');
const router = express.Router();
const rn_bridge = require('rn-bridge');
const middleware = require('../middleware/index');

router.post('/logins/:site', middleware.authenticateJWT, (req, res, next) => {
  const {payload} = req.body;
  // Get site param
  var site = req.params.site;

  // Get data from app
  rn_bridge.channel.post('getData', site);
  //rn_bridge.channel.post('log', 'GET Request: Get password for ' + site);

  // Wait for data from app
  rn_bridge.channel.on('retrievedData', (nativeResponse) => {
    try {
      if (nativeResponse) {
        // Data exists
        const logins = {};
        nativeResponse.map(({id, username, password}) => {
          logins[id] = {username, password};
        });
        req.body.payload = {
          ...payload,
          logins,
        };
        next();
      } else {
        return res.sendStatus(404);
      }
    } catch {
      next();
    }
  });
});

router.post('/', middleware.authenticateJWT, (req, res, next) => {
  // Get login data
  const {decryptedData} = req.body;
  const {website, username, password} = decryptedData;

  if (decryptedData && !(website && username && password)) {
    return res.sendStatus(400);
  }

  // Send data from app
  rn_bridge.channel.post('saveData', {website, username, password});
  //rn_bridge.channel.post('log', 'POST Request: New login information');

  // Wait for data from app
  rn_bridge.channel.on('savedData', (nativeResponse) => {
    try {
      if (nativeResponse && nativeResponse.status === 'OK') {
        // Data exists
        return res.status(200).json(nativeResponse);
      } else {
        return res.sendStatus(500);
      }
    } catch {
      next();
    }
  });
});

module.exports = router;
