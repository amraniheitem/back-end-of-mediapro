const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telephone: { type: String, trim: true },
    poste: { type: String, required: true, trim: true }, // ex: animateur, voix off, technicien
    cvUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    photoprofil: { type: String, trim: true },
    motivation: { type: String, trim: true },
    status: { type: String, enum: ["en_attente", "acceptée", "refusée"], default: "en_attente", index: true },
    dateteam: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

teamSchema.index({ email: 1, poste: 1, dateteam: -1 });

module.exports = mongoose.model("Team", teamSchema);
