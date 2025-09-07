const mongoose = require('mongoose');



const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Doit être un ObjectId
    ref: 'User',
    required: true // Validation activée
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
});

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
  description: { type: String, default :"" },
  prix_heure: { type: Number, default :"" },
  available: { type: Boolean, required: true,default:'true' },
  photo_profil: { type: String, required: false, default: '' },
  video_presentatif: { type: String, required: false, default: '' },
  ratings: [ratingSchema],
  averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
  },
  event : {type:Number,default : 0} ,
  nbrLike : {type : Number , default : 0} ,
  type:{type : [String] , required : true}
});

module.exports = mongoose.model('Animateur', animateurSchema);
