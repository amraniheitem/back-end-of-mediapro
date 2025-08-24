// models/promo.js
const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema(
{
titre: { type: String, required: true, trim: true },
description: { type: String, trim: true },
reduction: { type: Number, min: 0, max: 100, required: true }, // pourcentage
dateDebut: { type: Date, required: true },
dateFin: { type: Date, required: true },
actif: { type: Boolean, default: true },
image: { type: String, trim: true }, // Ajout de l'image (URL ou chemin)
},
{ timestamps: true }
);

// Virtual pour savoir si la promo est encore active
promoSchema.virtual("estActive").get(function () {
const now = new Date();
return this.actif && now >= this.dateDebut && now <= this.dateFin;
});

promoSchema.index({ dateDebut: 1, dateFin: 1 });


module.exports = mongoose.model("Promo", promoSchema);