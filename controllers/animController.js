const Animateur = require("../models/animateur");
const mongoose = require('mongoose');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(uploadError, '/uploads'); 
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-'); 
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage }).single('images')


const getAll = async (req, res) => {
    const animateurList = await Animateur.find().select({ nom: 1, prenom: 1, wilaya: 1, photo_profil: 1, nbrLike :1,ranking : 1 });

    if (!animateurList) {
        res.status(500).json({ success: false });
    } 
    res.send(animateurList);
};

const getOne = async (req, res) => {
    try {
        const animateur = await Animateur.findById(req.params.id);

        if (!animateur) {
            return res.status(404).json({ success: false, message: "Animateur non trouvé" });
        }

        res.send(animateur);
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

const add = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Photo de profil obligatoire' });
        }

        const animateur = new Animateur({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            numero: req.body.numero,
            sex: req.body.sex,
            niveau: req.body.niveau,
            wilaya: req.body.wilaya,
            adresse: req.body.adresse,
            numero_carte: req.body.numero_carte,
            available: req.body.available,
            photo_profil: req.file.filename,
            video_presentatif: req.body.video_presentatif || '',
            ranking: req.body.ranking || 0,
        });

        const savedAnimateur = await animateur.save();

        res.status(201).send(savedAnimateur);
    } catch (error) {
        console.error('Erreur lors de la création de l\'animateur :', error);
        res.status(500).send({ message: 'Erreur serveur', error });
    }
};

const update = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de l'animateur invalide");
    }

    try {
        const animateur = await Animateur.findById(req.params.id);
        if (!animateur) {
            return res.status(400).send("Animateur non trouvé");
        }

        const nouveau_animateur = await Animateur.findByIdAndUpdate(
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

        if (!nouveau_animateur) {
            return res.status(500).send("L'animateur n'a pas pu être mis à jour");
        }

        res.send(nouveau_animateur);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletes = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("ID de l'animateur invalide");
    }

    try {
        const animateur = await Animateur.findByIdAndDelete(req.params.id);

        if (animateur) {
            return res.status(200).json({ success: true, message: "L'animateur est supprimé!" });
        } else {
            return res.status(404).json({ success: false, message: "Animateur non trouvé!" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};

module.exports = { getAll, getOne, add, update, deletes };
