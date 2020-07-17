const express = require('express');
const router = express.Router();
const rn_bridge = require('rn-bridge');
const middleware = require('../middleware/authenticateJWT');

router.get('/:site', middleware.authenticateJWT, (req, res, next) => {
  // Get site param
  var site = req.params.site;

  // Get data from app
  rn_bridge.channel.post('getData', site);
  //rn_bridge.channel.post('log', 'GET Request: Get password for ' + site);

  // Wait for data from app
  rn_bridge.channel.on('retrievedData', (nativeResponse) => {
    try {
      if (nativeResponse && nativeResponse.status === 'OK') {
        // Data exists
        return res.json(nativeResponse);
      } else {
        return res.status(404);
      }
    } catch {
      next();
    }
  });
});

router.post('/', middleware.authenticateJWT, (req, res, next) => {
  // Get login data
  const {website, username, password} = req.body;

  if (!(website && username && password)) {
    return res.status(400);
  }

  // Send data from app
  rn_bridge.channel.post('sendData', {website, username, password});
  //rn_bridge.channel.post('log', 'POST Request: New login information');

  // Wait for data from app
  rn_bridge.channel.on('recievedData', (nativeResponse) => {
    try {
      if (nativeResponse && nativeResponse.status === 'OK') {
        // Data exists
        return res.status(200).json(nativeResponse);
      } else {
        return res.status(500);
      }
    } catch {
      next();
    }
  });
});

module.exports = router;
