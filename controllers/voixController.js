const Voix = require("../models/voix");
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
    try {
        const voixList = await Voix.find({});
        
        if (!voixList || voixList.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Aucune voix off trouvée" 
            });
        }
        
        res.status(200).json({
            success: true,
            count: voixList.length,
            data: voixList
        });
        
    } catch (err) {
        console.error("Erreur lors de la récupération :", err);
        res.status(500).json({
            success: false,
            error: "Erreur serveur",
            details: err.message
        });
    }
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
        let voix = new Voix({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            numero: req.body.numero,
            sex: req.body.sex,
            niveau: req.body.niveau,
            wilaya: req.body.wilaya,
            adresse: req.body.adresse,
            description: req.body.description,
            numero_carte: req.body.numero_carte,
            photo_profil: req.body.photo_profil || '',
            video_presentatif: req.body.video_presentatif || '',
            langue: req.body.langue || 'Français', // Valeur par défaut
            available: req.body.available ?? true // Valeur par défaut
        });

        voix = await voix.save();

        res.status(201).json(voix);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
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

const ratingVoix = async (req, res) => {
    try {
      const voix = await Voix.findById(req.params.id);
      if (!voix) {
        return res.status(404).json({ 
          success: false,
          message: "Voix-off non trouvée" 
        });
      }
  
      const userId = req.user.userId;
  
      // Vérification avec optional chaining
      const existingRating = voix.ratings?.find(r => 
        r.userId.toString() === userId
      );
  
      if (existingRating) {
        return res.status(400).json({ 
          success: false,
          message: "Vous avez déjà noté cette voix-off"
        });
      }
  
      // Initialiser ratings si nécessaire
      if (!voix.ratings) voix.ratings = [];
  
      // Ajout de la note
      voix.ratings.push({
        userId: new mongoose.Types.ObjectId(userId),
        value: req.body.rating
      });
  
      // Calcul moyenne
      const total = voix.ratings.reduce((sum, r) => sum + r.value, 0);
      voix.averageRating = total / voix.ratings.length;
  
      await voix.save();
  
      res.status(201).json({
        success: true,
        averageRating: voix.averageRating.toFixed(1),
        totalRatings: voix.ratings.length
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  };

module.exports = { getAll, getOne, add, update, deletes,ratingVoix };
