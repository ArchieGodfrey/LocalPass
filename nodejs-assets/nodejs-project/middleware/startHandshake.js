var crypto = require('crypto');
const algorithm = 'aes-256-cbc';
//const AESKey = crypto.randomBytes(32);
//const iv = crypto.randomBytes(16);

// Create public key
const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const startHandshake = (req, res, next) => {
  const {encrypted, iv, aesKey} = req.body;

  // 1) Prepare RSA Public key to be exported
  const exportedKey = publicKey
    .export({type: 'spki', format: 'der'})
    .toString('base64');

  req.body.publicKey = exportedKey;

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

    console.log('Decrypted data: ', decryptedAESData);
    return res.json({status: 'OK'});
  }
  next();
};

module.exports.startHandshake = startHandshake;

// const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
// });

// router.post('/', (req, res) => {
//   const {encrypted, aesKey, key} = req.body;
//   console.log(req.body);

//   // If initial contact
//   if (key) {
//     // 1) Prepare RSA Public key to be exported
//     const exportedKey = publicKey
//       .export({type: 'spki', format: 'der'})
//       .toString('base64');

//     // 2) Encrypt AES key with External Public Key
//     const encryptedAESKey = RSAEncrypt(key, AESKey);

//     // 3) Encrypt message with AES
//     const encryptedAes = AESEncrypt('Some serious stuff');

//     return res.json({
//       publicKey: exportedKey,
//       aesData: encryptedAes.encryptedData,
//       aesIV: encryptedAes.iv,
//       aesKey: encryptedAESKey.toString('base64'),
//       status: 'OK',
//     });
//   }

//   // Encrypted message being returned
//   if (encrypted) {
//     console.log('Recieved: ', encrypted);

//     // 1) Convert AES Key string to buffer
//     const AESKeyBuffer = Buffer.from(aesKey, 'base64');
//     console.log('AES Key Buffer: ', AESKeyBuffer.byteLength, AESKeyBuffer);

//     // 2) Decrypt AES Key using private key
//     const decryptedAESKey = RSADecrypt(privateKey, AESKeyBuffer).toString(
//       'ascii',
//     );
//     console.log('Decrypted AES Key: ', decryptedAESKey);

//     // 3) Decrypt message using AES key
//     const decryptedData = AESDecrypt(encrypted, decryptedAESKey);
//     console.log('Decrypted data: ', decryptedData.toString());
//     return res.json({status: 'OK'});
//   }

//   return res.status(500);
// });

// const RSAEncrypt = (key, data) =>
//   crypto.publicEncrypt(
//     {
//       key,
//       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//       oaepHash: 'sha256',
//     },
//     Buffer.from(data),
//   );

const RSADecrypt = (key, data) =>
  crypto.privateDecrypt(
    {
      key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    data,
  );

// function AESEncrypt(text) {
//   let cipher = crypto.createCipheriv(algorithm, Buffer.from(AESKey), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
// }

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
