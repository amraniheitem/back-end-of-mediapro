const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prénom: { type: String, required: true },
  date: { type: String, required: true },
  numéro: { type: String, required: true },
  wilaya: { type: String, required: true },
  email: { 
    type: String, 
    index: {
      unique: true,
      sparse: true 
    }
  },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }

});

module.exports = mongoose.model('User', userSchema);
