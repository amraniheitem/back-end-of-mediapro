// models/user-desktop.js
const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  deviceName: String,
  ip: String,
  lastLogin: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true  },
  wilaya: { type: String },
  password: { type: String, required: true },
  poste: { type: String  },
  secteur: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // 2FA
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,

  // Forgot password (OTP)
  resetPasswordToken: String,           // stocke le code OTP (ex: "123456")
  resetPasswordExpires: Date,          // date d'expiration du code
  resetPasswordVerified: { type: Boolean, default: false }, // true après vérif du code

  devices: [DeviceSchema],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
