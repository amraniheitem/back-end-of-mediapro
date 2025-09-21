const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const multer = require('multer');
const { getCloudinaryStorage } = require('../utils/cloudinary');

// ⚡ Utiliser Cloudinary au lieu de diskStorage
const upload = multer({
  storage: getCloudinaryStorage('courses'), // Dossier Cloudinary : MediaPro/courses
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
}).single('imageOfCourse'); // ✅ correspond au champ du frontend

// 🎯 Middleware pour gérer les erreurs d'upload
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Erreur lors du téléchargement de l’image',
        error: err.message
      });
    }
    next();
  });
};

// ----------------- ROUTES -----------------

// 📌 Récupérer un cours par ID
router.get('/search/:id', courseController.getOnecourse);

// 📌 Liste de tous les cours
router.get('/list', courseController.getcourses);

// 📌 Ajouter un nouveau cours (avec Cloudinary)
router.post('/add', handleUpload, courseController.createcourse);

// 📌 Mettre à jour un cours (Cloudinary gère aussi une nouvelle image si envoyée)
router.patch('/update/:id', handleUpload, courseController.updatecourse);

// 📌 Supprimer un cours
router.delete('/delete/:id', courseController.deletecourse);

module.exports = router;
