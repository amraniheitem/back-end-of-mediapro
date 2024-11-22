const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prénom: { type: String, required: true },
  date: { type: String, required: true },
  numéro: { type: String, required: true },
  wilaya : {type : String , required : true},
  email: { type: String, unique: true}, 
  password: String,
  confirmed_password: String,
  isConfirmed: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
