const express = require('express');
const router = express.Router();
const middleware = require('../middleware/index');

router.get('/', middleware.authenticateJWT, (req, res) => {
  return res.sendStatus(200);
});

module.exports = router;
