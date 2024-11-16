const Voix = require("../models/voix");
const mongoose = require('mongoose');

const getAll = async (req, res) => {
    const voixList = await Voix.find().select({ nom: 1, prenom: 1, wilaya: 1, photo_profil: 1, video_presentatif: 1,ranking :1 });

    if (!voixList) {
        res.status(500).json({ success: false });
    } 
    res.send(VoixList);
};

const getOne = async (req, res) => {
    try {
        const voix = await Voix.findById(req.params.id);

        if (!voix) {
            return res.status(404).json({ success: false, message: "Voixoff non trouvé" });
        }

        res.send(voix);
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

const add = async (req, res) => {
    try {
        let voix = new voix({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            numero: req.body.numero,
            sex: req.body.sex,
            niveau: req.body.niveau,
            wilaya: req.body.wilaya,
            adresse: req.body.adresse,
            numero_carte: req.body.numero_carte,
            photo_profil: req.body.photo_profil,
            video_presentatif: req.body.video_presentatif,
        });

        voix = await voix.save();

        if (!voix) {
            return res.status(500).send("voixoff n'est pas créé");
        }

        res.send(voix);
    } catch (err) {
        res.status(500).send("Erreur serveur");
    }
};

const update = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de l'voix invalide");
    }

    try {
        const voix = await Voix.findById(req.params.id);
        if (!voix) {
            return res.status(400).send("voixoff non trouvé");
        }

        const nouveau_voix = await Voix.findByIdAndUpdate(
            req.params.id,
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                numero: req.body.numero,
                sex: req.body.sex,
                niveau: req.body.niveau,
                wilaya: req.body.wilaya,
                adresse: req.body.adresse,
                numero_carte: req.body.numero_carte,
                photo_profil: req.body.photo_profil,
                video_presentatif: req.body.video_presentatif,
            },
            { new: true }
        );

        if (!nouveau_voix) {
            return res.status(500).send("Le voixoff n'a pas pu être mis à jour");
        }

        res.send(nouveau_voix);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletes = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de le voixoff invalide");
    }

    try {
        const voix = await Voix.findByIdAndDelete(req.params.id);

        if (voix) {
            return res.status(200).json({ success: true, message: "Le voix off est supprimé!" });
        } else {
            return res.status(404).json({ success: false, message: "voix off non trouvé!" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};

module.exports = { getAll, getOne, add, update, deletes };
