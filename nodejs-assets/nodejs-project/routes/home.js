const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.sendStatus(200);
});

router.post('/', (req, res, next) => {
  const {payload} = req.body;

  req.body.payload = {...payload, test: 'This is a test'};
  next();
});

module.exports = router;
