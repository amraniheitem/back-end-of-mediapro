const express = require('express');
const router = express.Router();
const voixController = require('../controllers/voixController');
const authMiddleware = require('../middleware/authMiddleware');
const { getCloudinaryStorage } = require('../utils/cloudinary');
const multer = require('multer');

// 📸 Multer avec Cloudinary (stockage dans "team")
const upload = multer({
  storage: getCloudinaryStorage('voix'),
}).single('photo_profil');

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
router.get('/getAll', voixController.getAll);
router.get('/getOne/:id', voixController.getOne);

// ➕ Ajouter une voix avec photo profil
router.post('/add', upload, voixController.add);

// ✏️ Mise à jour (si nouvelle photo => remplacée)
router.patch('/update/:id', upload, voixController.update);

// 🗑️ Supprimer
router.delete('/suprimmer/:id', voixController.deletes);

// ⭐ Notation
router.post('/:id/rate', authMiddleware, voixController.ratingVoix);

module.exports = router;
