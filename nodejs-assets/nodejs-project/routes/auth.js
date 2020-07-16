const express = require('express');
const jwt = require('jsonwebtoken');
const rn_bridge = require('rn-bridge');
const router = express.Router();

const config = require('../config/config');
const users = [
  {
    username: 'john',
    password: 'password123admin',
    role: 'admin',
  },
  {
    username: 'anna',
    password: 'password123member',
    role: 'member',
  },
];

router.post('/login', (req, res, next) => {
  // Get response
  const {username} = req.body;

  /* read username and password from request body
  const {username, password} = req.body;

  // filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });*/

  if (username) {
    // Ask user for access
    rn_bridge.channel.post(
      'requestAccess',
      `User: ${username} is requesting access`,
    );

    // Wait for user to respond on device
    rn_bridge.channel.on('accessStatus', (nativeResponse) => {
      try {
        if (nativeResponse && nativeResponse.status === 'ACCEPTED') {
          // generate an access token
          const accessToken = jwt.sign(
            {username: username},
            config.ACCESS_SECRET,
            {expiresIn: '20m'},
          );
          const refreshToken = jwt.sign(
            {username: username},
            config.REFRESH_SECRET,
          );

          config.REFRESH_TOKENS.push(refreshToken);

          return res.json({
            accessToken,
            refreshToken,
          });
        } else {
          return res.status(403).json({access: 'Access Denied'});
        }
      } catch {
        next();
      }
    });
  }
});

/*if (user) {
    // generate an access token
    const accessToken = jwt.sign(
      {username: user.username, role: user.role},
      config.ACCESS_SECRET,
      {expiresIn: '20m'},
    );
    const refreshToken = jwt.sign(
      {username: user.username, role: user.role},
      config.REFRESH_SECRET,
    );

    config.REFRESH_TOKENS.push(refreshToken);

    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.send('Username or password incorrect');
  }*/

// Extend token
router.post('/token', (req, res) => {
  const {token} = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!config.REFRESH_TOKENS.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, config.REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      {username: user.username, role: user.role},
      config.ACCESS_SECRET,
      {expiresIn: '20m'},
    );

    res.json({
      accessToken,
    });
  });
});

router.post('/logout', (req, res) => {
  const {token} = req.body;
  config.REFRESH_TOKENS = config.REFRESH_TOKENS.filter((t) => t !== token);

  res.send('Logout successful');
});

module.exports = router;
