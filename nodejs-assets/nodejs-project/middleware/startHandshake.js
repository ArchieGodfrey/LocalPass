const Buffer = require('buffer').Buffer;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// Create public key
const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const startHandshake = (req, res, next) => {
  const {encrypted, iv, aesKey, initial} = req.body;

  // 1) Prepare RSA Public key to be exported
  const exportedKey = publicKey
    .export({type: 'spki', format: 'der'})
    .toString('base64');

  // 2) Attach to the request to be sent later
  req.body.publicKey = exportedKey;

  // 3) If initial, encrypted payload to come
  if (initial) {
    return res.json({
      publicKey: exportedKey,
      status: 'OK',
    });
  }

  if (encrypted && aesKey) {
    // 1) Convert AES Key and iv strings to buffers
    const AESKeyBuffer = Buffer.from(aesKey, 'base64');
    const AESIVBuffer = Buffer.from(iv, 'base64');

    // 2) Decrypt AES Key and iv using private key
    const decryptedAESKey = RSADecrypt(privateKey, AESKeyBuffer).toString(
      'ascii',
    );
    const decryptedIV = RSADecrypt(privateKey, AESIVBuffer).toString('ascii');

    // 3) Decrypt data using AES key and iv
    const decryptedAESData = {};
    const keys = Object.keys(encrypted);
    keys.forEach((key) => {
      decryptedAESData[key] = AESDecrypt(
        decryptedAESKey,
        decryptedIV,
        encrypted[key],
      );
    });
    req.body.decryptedData = decryptedAESData;
  }
  next();
};

const RSADecrypt = (key, data) =>
  crypto.privateDecrypt(
    {
      key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    data,
  );

function AESDecrypt(key, iv, text) {
  let ivBuf = Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, 'base64'),
    ivBuf,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports.startHandshake = startHandshake;
