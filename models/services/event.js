// models/event.js
const mongoose = require("mongoose");

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/; // "HH:MM" 24h

const eventSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    lieu: { type: String, required: true, trim: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date },
    heure: { type: String, trim: true, match: timeRegex }, // ex: "14:30"
    typeEvenement: { type: String, required: true, trim: true },
    prix: { type: Number, default: 0, min: 0 },

    responsable: { type: String, trim: true },

    animateurNormal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animateur",
      default: null,
    },
    animateurVip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnimateurVip",
      default: null,
    },
    typeAnimateur: {
      type: String,
      enum: ["normal", "vip"],
      default: null,
    },

    participants:  { type: Number, default:0 , trim: true },
  },
  { timestamps: true }
);

// Index sur la date de début
eventSchema.index({ dateDebut: 1 });

// Validation: un seul des deux doit être défini
eventSchema.pre("validate", function (next) {
  const hasNormal = !!this.animateurNormal;
  const hasVip = !!this.animateurVip;

  if ((hasNormal && hasVip) || (!hasNormal && !hasVip)) {
    this.invalidate(
      "animateur",
      "Choisis exactement un seul animateur: soit animateurNormal soit animateurVip."
    );
  }

  // Déduire typeAnimateur si non fourni
  if (!this.typeAnimateur) {
    if (hasNormal) this.typeAnimateur = "normal";
    if (hasVip) this.typeAnimateur = "vip";
  }

  // Cohérence typeAnimateur ↔ champ rempli
  if (this.typeAnimateur === "normal" && !hasNormal) {
    this.invalidate("typeAnimateur", "typeAnimateur=normal mais animateurNormal manquant.");
  }
  if (this.typeAnimateur === "vip" && !hasVip) {
    this.invalidate("typeAnimateur", "typeAnimateur=vip mais animateurVip manquant.");
  }

  next();
});

// Validation: dateFin >= dateDebut si renseignée
eventSchema.pre("save", function (next) {
  if (this.dateFin && this.dateFin < this.dateDebut) {
    return next(new Error("dateFin doit être supérieure ou égale à dateDebut."));
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
