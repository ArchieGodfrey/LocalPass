const rn_bridge = require('rn-bridge');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Temp vars
let server;
let tempAddress = '';
let tempStorage = '';

// Require routes
const auth = require('./routes/auth');
const manager = require('./routes/manager');

// Setup middleware

/* Allow CORS policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Setup routes
app.use('/auth', auth);
app.use('/manager', manager);

// Listen for messages sent from React-Native
rn_bridge.channel.on('message', (req) => {
  // When given an address
  if (req.address) {
    if (app.listening) {
      app.close();
    }
    server = app.listen(8080, req.address);
    tempAddress = `http://${req.address}:8080`;
    rn_bridge.channel.send(`Server started on: http://${req.address}:8080`);
  }
  // Close the server
  if (req.status && req.status === 'close') {
    if (server) {
      server.close();
      rn_bridge.channel.send('Server closed');
    } else {
      rn_bridge.channel.send('No server to close');
    }
  }
  // Send a password to server
  if (req.password) {
    tempStorage = req.password;
    rn_bridge.channel.send('Password Recieved');
  }
});
