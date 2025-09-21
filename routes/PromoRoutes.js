const express = require('express');
const router = express.Router();
const controller = require('../controllers/promoController');
const multer = require('multer');
const { getCloudinaryStorage } = require('../utils/cloudinary');

// ⚡ Multer avec Cloudinary (utilise le storage centralisé)
const upload = multer({
  storage: getCloudinaryStorage('promo'),
}).single('image');

// Middleware pour gérer les erreurs d’upload
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de téléchargement',
        error: err.message,
      });
    }
    next();
  });
};

// Routes
router.route('/')
  .post(handleUpload, controller.createPromo)
  .get(controller.getAllPromo);

router.route('/:id')
  .delete(controller.deletePromo)
  .get(controller.getOnePromo)
  .patch(handleUpload, controller.updatePromo);

module.exports = router;
