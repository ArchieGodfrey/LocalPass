const rn_bridge = require('rn-bridge');
const express = require('express');
const request = require('request');
const app = express();

let server = undefined;
let tempAddress = '';
let tempStorage = '';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/getPasswords', (req, res) => {
  res.send(tempStorage);
});

app.get('/', (req, res) => {
  request({url: `${tempAddress}/getPasswords`}, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res
        .status(500)
        .json({type: 'error', message: response.statusCode});
    }
    res.send(body);
    //res.json(JSON.parse(body));
  });
});

//app.listen(8080, '192.168.1.43');

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
