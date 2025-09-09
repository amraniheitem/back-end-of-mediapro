// utils/generateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role || "user",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
