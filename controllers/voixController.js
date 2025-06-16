const Voix = require("../models/voix");
const mongoose = require('mongoose');

// GET ALL
const getAll = async (req, res) => {
    try {
        const voixList = await Voix.find().select({
            nom: 1,
            prenom: 1,
            wilaya: 1,
            photo_profil: 1,
            nbrLike: 1,
            ratings: 1,
            averageRating: 1,
            email: 1,
            numero: 1,
            sex: 1,
            adresse: 1
        });

        if (!voixList) {
            return res.status(404).json({ success: false, message: "Aucune voix off trouvée" });
        }

        res.status(200).json({ success: true, count: voixList.length, data: voixList });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET ONE
const getOne = async (req, res) => {
    try {
        const voix = await Voix.findById(req.params.id);

        if (!voix) {
            return res.status(404).json({ success: false, message: "Voix off non trouvée" });
        }

        res.send(voix);
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// ADD
const add = async (req, res) => {
    try {
        const voix = new Voix({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            numero: parseInt(req.body.numero),
            sex: req.body.sex,
            description: req.body.description,
            niveau: req.body.niveau,
            wilaya: req.body.wilaya,
            adresse: req.body.adresse,
            numero_carte: parseInt(req.body.numero_carte),
            available: req.body.available === 'true' || req.body.available === true,
            photo_profil: req.file ? req.file.filename : null,
            video_presentatif: req.body.video_presentatif || '',
            langue: req.body.langue || 'Français',
            ranking: req.body.ranking || 0,
            event: req.body.event || 0,
            nbrLike: req.body.nbrLike || 0,
            type: Array.isArray(req.body.type) ? req.body.type : [req.body.type]
        });

        const savedVoix = await voix.save();

        res.status(201).send(savedVoix);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// UPDATE
const update = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de la voix invalide");
    }

    try {
        const voix = await Voix.findById(req.params.id);
        if (!voix) return res.status(404).send("Voix off non trouvée");

        const updated = await Voix.findByIdAndUpdate(
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

        if (!updated) return res.status(500).send("Mise à jour échouée");

        res.send(updated);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
const deletes = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de la voix invalide");
    }

    try {
        const voix = await Voix.findByIdAndDelete(req.params.id);

        if (voix) {
            return res.status(200).json({ success: true, message: "Voix off supprimée !" });
        } else {
            return res.status(404).json({ success: false, message: "Voix off non trouvée" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// RATING
const ratingVoix = async (req, res) => {
    try {
        const voix = await Voix.findById(req.params.id);
        const userId = req.user.userId;

        const existingRating = voix.ratings?.find(r =>
            r.userId.toString() === userId
        );

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: "Vous avez déjà noté cette voix-off"
            });
        }

        if (!voix.ratings) voix.ratings = [];

        voix.ratings.push({
            userId: new mongoose.Types.ObjectId(userId),
            value: req.body.rating
        });

        const total = voix.ratings.reduce((sum, r) => sum + r.value, 0);
        voix.averageRating = total / voix.ratings.length;

        await voix.save();

        res.status(201).json({
            success: true,
            averageRating: voix.averageRating.toFixed(1),
            totalRatings: voix.ratings.length
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAll,
    getOne,
    add,
    update,
    deletes,
    ratingVoix
};
