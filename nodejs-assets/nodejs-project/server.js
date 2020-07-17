const rn_bridge = require('rn-bridge');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Temp vars
let server;

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
      server = undefined;
    }
    server = app.listen(8080, req.address);
    rn_bridge.channel.post('startedServer');
    rn_bridge.channel.post('log', 'Native Request: Started Server');
  }
});

// Close server
rn_bridge.channel.on('closeServer', () => {
  rn_bridge.channel.post('log', 'Native Request: Close Server');
  if (server) {
    server.close(() => {
      rn_bridge.channel.post('closedServer', '');
      rn_bridge.channel.post('log', 'Native Request: Closed Server');
    });
    server = undefined;
  }
});
