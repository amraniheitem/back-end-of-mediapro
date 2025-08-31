const express = require('express');
const router = express.Router();
const controller = require('../controllers/promoController');

const multer = require('multer');
const path = require('path');

// Configuration du stockage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/promo');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `promo-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Filtre de fichiers
const fileFilter = (req, file, cb) => {
  if (file.fieldname !== 'image') {
    return cb(null, false);
  }
  
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    return cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

// Middleware pour gérer l'upload
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de téléchargement',
        error: err.message
      });
    }
    next();
  });
};

router.route('/')
  .post(handleUpload, controller.createPromo)
  .get(controller.getAllPromo);

router.route('/:id')
  .delete(controller.deletePromo)
  .get(controller.getOnePromo)
  .patch(handleUpload, controller.updatePromo);

module.exports = router;
