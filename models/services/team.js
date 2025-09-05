const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    // --- Type (normal | executif) ---
    type: {
      type: String,
      enum: ["normal", "executif"],
      default: "normal",
      required: true,
    },

    // --- Informations personnelles ---
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    dateNaissance: { type: Date },
    adresse: { type: String, trim: true },
    telephone: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },

    // --- Informations administratives ---
    numeroCIN: { type: String, trim: true, unique: true, sparse: true },

    // Pour "executif" → poste requis ; pour "normal" poste non obligatoire
    poste: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "executif";
      },
    },

    // Pour "normal" → fonction requise ; pour "executif" fonction optionnelle
    fonction: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "normal";
      },
    },

    departement: { type: String, trim: true }, // ex: RH, IT, Finance
    dateEmbauche: { type: Date, default: Date.now },
    salaire: { type: Number },

    photoprofil: { type: String, trim: true },
    cvUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    carteIdentiteUrl: { type: String, trim: true },

    motivation: { type: String, trim: true },
    status: {
      type: String,
      enum: ["en_attente", "acceptée", "refusée", "active", "inactive"],
      default: "en_attente",
      index: true,
    },

    // --- Métadonnées ---
    dateteam: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index pour optimiser les recherches
teamSchema.index({ nom:1,prenom:1, email: 1, poste: 1, dateteam: -1 });

module.exports = mongoose.model("Team", teamSchema);
