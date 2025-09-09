const speakeasy = require("speakeasy");

const verify2FA = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // tolérance de 30s
  });
};

module.exports = verify2FA;
