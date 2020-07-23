const authenticateJWT = require('./authenticateJWT');
const startHandshake = require('./startHandshake');
const endHandshake = require('./endHandshake');

module.exports.authenticateJWT = authenticateJWT.authenticateJWT;
module.exports.startHandshake = startHandshake.startHandshake;
module.exports.endHandshake = endHandshake.endHandshake;
