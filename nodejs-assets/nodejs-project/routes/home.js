const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const {token} = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  return res.sendStatus(200);
});

module.exports = router;
