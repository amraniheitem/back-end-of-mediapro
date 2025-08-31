// models/Client.js
const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  email: { type: String, required: true, unique: true },
  telephone: { type: String },
  adresse: { type: String },

  typeClient: { 
    type: String, 
    enum: ["Boutique", "Agence", "Entreprise", "Particulier"], 
    required: true 
  },

  entreprise: { type: String }, // si client entreprise
  poste: { type: String },      // si besoin (manager, directeur...)

  conventions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Convention" }],

  dateInscription: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", ClientSchema);
