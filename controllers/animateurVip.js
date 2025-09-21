const Animateur = require("../models/animateurVip");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


// Vérification du type de fichier

const { getCloudinaryStorage} = require("../utils/cloudinary");

// ✅ Cloudinary storage
const upload = multer({ storage: getCloudinaryStorage("animateurVip") });
const uploadOptions = upload.single("photo_profil");

// ✅ GET ALL
const getAll = async (req, res) => {
    try {
        const animateurList = await Animateur.find().select({
            nom: 1,
            prenom: 1,
            wilaya: 1,
            photo_profil: 1,
            nbrLike: 1,
            ratings: 1,
            event: 1,
            averageRating: 1,
            email: 1,
            numero: 1,
            sex: 1,
            prix_heure:1,

            adresse: 1
        });

        res.send(animateurList);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ GET ONE
const getOne = async (req, res) => {
    try {
        const animateur = await Animateur.findById(req.params.id);
        if (!animateur) {
            return res.status(404).json({ success: false, message: "Animateur non trouvé" });
        }
        res.send(animateur);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ ADD
const add = async (req, res) => {
  try {
    const animateur = new Animateur({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      numero: parseInt(req.body.numero),
      sex: req.body.sex,
      description: req.body.description,
      niveau: req.body.niveau,
      wilaya: req.body.wilaya,
      adresse: req.body.adresse,
      prix_heure: req.body.prix_heure,
      numero_carte: parseInt(req.body.numero_carte),
      available: req.body.available === "true" || req.body.available === true,
      photo_profil: req.file ? req.file.path : null, 
      video_presentatif: req.body.video_presentatif || "",
      ranking: req.body.ranking || 0,
      event: req.body.event || 0,
      nbrLike: req.body.nbrLike || 0,
      type: Array.isArray(req.body.type) ? req.body.type : [req.body.type],
    });

    const saved = await animateur.save();
    res.status(201).send(saved);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// ✅ UPDATE
const update = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID invalide");
    }

    try {
        const animateur = await Animateur.findByIdAndUpdate(
            req.params.id,
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                numero: req.body.numero,
                sex: req.body.sex,
                niveau: req.body.niveau,
                wilaya: req.body.wilaya,
                prix_heure: req.body.prix_heure,
event:req.body.event,
nbrLike : req.body.nbrLike,
                adresse: req.body.adresse,
                numero_carte: req.body.numero_carte,
                photo_profil: req.body.photo_profil,
                video_presentatif: req.body.video_presentatif,
            },
            { new: true }
        );

        if (!animateur) {
            return res.status(500).send("Échec de la mise à jour");
        }

        res.send(animateur);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ DELETE
const deletes = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID invalide");
    }

    try {
        const animateur = await Animateur.findByIdAndDelete(req.params.id);
        if (animateur) {
            return res.status(200).json({ success: true, message: "Animateur supprimé" });
        } else {
            return res.status(404).json({ success: false, message: "Animateur introuvable" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};

// ✅ RATING
const ratingAnimateur = async (req, res) => {
    try {
        const animateur = await Animateur.findById(req.params.id);
        const userId = req.user.userId;

        const existingRating = animateur.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            return res.status(400).json({ success: false, message: "Déjà noté" });
        }

        animateur.ratings.push({
            userId: new mongoose.Types.ObjectId(userId),
            value: req.body.rating
        });

        const total = animateur.ratings.reduce((sum, r) => sum + r.value, 0);
        animateur.averageRating = total / animateur.ratings.length;

        await animateur.save();

        res.status(201).json({
            success: true,
            averageRating: animateur.averageRating.toFixed(1),
            totalRatings: animateur.ratings.length
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
    ratingAnimateur,
    uploadOptions
};
