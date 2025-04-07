const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prénom: { type: String, required: true },
  numéro: { type: String, required: true },
  numéro_carte: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
});

module.exports = mongoose.model('Userdesktop', userSchema);
