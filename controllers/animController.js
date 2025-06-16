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

const uploadOptions = multer({ storage: storage }).single('photo_profil')


const getAll = async (req, res) => {
    const animateurList = await Animateur.find().select({           nom: 1,
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
        adresse: 1
});

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
            numero_carte: parseInt(req.body.numero_carte),
            available: req.body.available === 'true' || req.body.available === true,
            photo_profil: req.file ? req.file.filename : null,
            video_presentatif: req.body.video_presentatif || '',
            ranking: req.body.ranking || 0,
            event: req.body.event || 0,
            nbrLike: req.body.nbrLike || 0,
            type: Array.isArray(req.body.type) ? req.body.type : [req.body.type]
        });

        const savedAnimateur = await animateur.save();
        res.status(201).send(savedAnimateur);
    } catch (error) {
        res.status(500).send({ message: 'Erreur serveur', error: error.message });
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
const ratingAnimateur = async (req, res) => {
    try {
      const animateur = await Animateur.findById(req.params.id);
      const userId = req.user.userId; // Récupéré du middleware
  
      // Vérifier si l'utilisateur a déjà noté
      const existingRating = animateur.ratings.find(r => 
        r.userId.toString() === userId
      );
  
      if (existingRating) {
        return res.status(400).json({ 
          success: false,
          message: "Vous avez déjà noté cet animateur"
        });
      }
  
      // Ajouter la nouvelle note AVEC userId
      animateur.ratings.push({
        userId: new mongoose.Types.ObjectId(userId), // Conversion explicite
        value: req.body.rating
      });
  
      // Calculer la moyenne
      const total = animateur.ratings.reduce((sum, r) => sum + r.value, 0);
      animateur.averageRating = total / animateur.ratings.length;
  
      await animateur.save();
  
      res.status(201).json({
        success: true,
        averageRating: animateur.averageRating.toFixed(1),
        totalRatings: animateur.ratings.length
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
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