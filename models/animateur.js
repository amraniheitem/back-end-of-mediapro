const mongoose = require('mongoose');

const animateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  numero: { type: Number, required: true },
  sex: { type: String, enum: ['Homme', 'Femme'], required: true },
  niveau: { type: String, required: true },
  wilaya: { type: String, required: true },
  adresse: { type: String, required: true },
  numero_carte: { type: Number, required: true },
  available: { type: Boolean, required: true },
  photo_profil: { type: String, required: true, default: '' },
  video_presentatif: { type: String, required: true, default: '' },
  ranking: { type: Number, default: 0 },
  event : {type:Number,default : 0} ,
  nbrLike : {type : Number , default : 0} ,
  type:{type : [String] , required : true}
});

module.exports = mongoose.model('Animateur', animateurSchema);
