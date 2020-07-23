var crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const AESKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const endHandshake = (req, res, next) => {
  const {key, publicKey, payload} = req.body;

  if (key && payload) {
    // 1) Encrypt AES key with External Public Key
    const encryptedAESKey = RSAEncrypt(key, Buffer.from(AESKey));

    // 2) Encrypt payload with AES key
    const encryptedAESData = {};
    const keys = Object.keys(payload);
    keys.forEach((item) => {
      encryptedAESData[item] = AESEncrypt(AESKey, iv, payload[item]);
    });

    // 3) Encrypt iv with External Public Key
    const encryptedIV = RSAEncrypt(key, iv);

    return res.json({
      publicKey,
      aesData: encryptedAESData,
      aesIV: encryptedIV.toString('hex'),
      aesKey: encryptedAESKey.toString('base64'),
      status: 'OK',
    });
  }
};

module.exports.endHandshake = endHandshake;

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

const RSAEncrypt = (key, data) =>
  crypto.publicEncrypt(
    {
      key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    data,
  );

// const RSADecrypt = (key, data) =>
//   crypto.privateDecrypt(
//     {
//       key,
//       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//       oaepHash: 'sha256',
//     },
//     data,
//   );

function AESEncrypt(key, IV, text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

// function AESDecrypt(text, key) {
//   let ivBuf = Buffer.from(text.iv, 'hex');
//   let encryptedText = Buffer.from(text.encryptedData, 'hex');
//   console.log(ivBuf, encryptedText, ivBuf.byteLength, encryptedText.byteLength);
//   let decipher = crypto
//     .createDecipheriv(algorithm, Buffer.from(key, 'base64'), ivBuf)
//     .setAutoPadding(false);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// }
