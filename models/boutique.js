const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    responsable: {
        type: String // ou mongoose.Schema.Types.ObjectId si tu veux relier à un utilisateur
    },
    description: {
        type: String
    },
        wilaya: {
        type: String
    },
    dateCreation: {
        type: Date,
        default: Date.now
    }
});

const Boutique = mongoose.model('Boutique', boutiqueSchema);

module.exports = { Boutique };
