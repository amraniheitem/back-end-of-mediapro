const express = require('express');
const router = express.Router();
const controller = require('../controllers/teamController');
const multer = require('multer');
const { getCloudinaryStorage } = require('../utils/cloudinary');

// 📸 Multer avec Cloudinary (stockage dans "team")
const upload = multer({
  storage: getCloudinaryStorage('team'),
}).single('photoprofil');

// 🔄 Middleware pour gérer les erreurs d’upload
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

// ----------------- ROUTES -----------------
router.route('/')
  .post(handleUpload, controller.createTeam)
  .get(controller.getAllTeam);

router.route('/:id')
  .delete(controller.deleteTeam)
  .get(controller.getOneTeam)
  .patch(handleUpload, controller.updateTeam);

module.exports = router;
