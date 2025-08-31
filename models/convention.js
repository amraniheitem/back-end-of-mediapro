// models/Convention.js
const mongoose = require("mongoose");

const ConventionSchema = new mongoose.Schema({
  titre: { type: String, required: true }, // ex: Convention Animateurs 2025
  description: { type: String },

  typeService: { 
    type: String, 
    enum: ["Animateur", "Voix-off", "Produit", "Formation"], 
    required: true 
  },

  partenaire: { type: String, required: true }, 
  // Ex: "Ministère de la Culture", "Studio XYZ", etc.

  dateDebut: { type: Date, required: true },
  dateFin: { type: Date },

  montant: { type: Number },  // si convention financière
  conditions: { type: String }, // résumé des obligations

  statut: { 
    type: String, 
    enum: ["En cours", "Terminée", "Annulée"], 
    default: "En cours" 
  },

  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // convention liée à un client

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Convention", ConventionSchema);
