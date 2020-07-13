const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports.authenticateJWT = authenticateJWT;
