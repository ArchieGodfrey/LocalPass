const Buffer = require('buffer').Buffer;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const AESKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const endHandshake = (req, res) => {
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
  } else {
    return res.sendStatus(200);
  }
};

const RSAEncrypt = (key, data) =>
  crypto.publicEncrypt(
    {
      key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    data,
  );

function AESEncrypt(key, IV, text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

module.exports.endHandshake = endHandshake;
