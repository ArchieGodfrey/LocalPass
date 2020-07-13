const express = require('express');
const router = express.Router();
const rn_bridge = require('rn-bridge');
const middleware = require('../middleware/authenticateJWT');

router.get('/:site', middleware.authenticateJWT, (req, res) => {
  // Get site param
  var site = req.params.site;

  // Get data from app
  rn_bridge.channel.post('getData', site);

  // Wait for data from app
  rn_bridge.channel.on('retrievedData', (nativeResponse) => {
    if (nativeResponse && nativeResponse.status === 'OK') {
      // Data exists
      return res.status(200).json(nativeResponse);
    } else {
      return res.status(404);
    }
  });
});

module.exports = router;
