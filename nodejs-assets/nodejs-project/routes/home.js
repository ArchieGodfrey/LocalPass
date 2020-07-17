const express = require('express');
const rn_bridge = require('rn-bridge');
const router = express.Router();

router.get('/', (req, res) => {
  rn_bridge.channel.post('log', 'Server Response: Status Request');
  return res.sendStatus(200);
});

module.exports = router;
