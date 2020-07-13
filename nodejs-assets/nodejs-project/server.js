const rn_bridge = require('rn-bridge');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Temp vars
let server;
let tempStorage = '';

// Require routes
const home = require('./routes/home');
const auth = require('./routes/auth');
const manager = require('./routes/manager');

// Setup middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Setup routes
app.use('/', home);
app.use('/auth', auth);
app.use('/manager', manager);

// Listen for messages sent from React-Native

// Start server on given port
rn_bridge.channel.on('startServer', (req) => {
  if (req.address) {
    if (server) {
      server.close();
    }
    server = app.listen(8080, req.address);
    rn_bridge.channel.post('startedServer');
  }
});

// Close server
rn_bridge.channel.on('closeServer', () => {
  if (server) {
    server.close(() => {
      rn_bridge.channel.post('closedServer', '');
    });
    server = undefined;
  }
});

rn_bridge.channel.on('message', (req) => {
  // Send a password to server
  if (req.password) {
    tempStorage = req.password;
    rn_bridge.channel.send('Password Recieved');
  }
});
