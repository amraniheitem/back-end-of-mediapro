const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const multer = require('multer');
const path = require('path');

// Configuration du stockage
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/course');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `course-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// Filtre de fichiers
const fileFilter = (req, file, cb) => {
    if (file.fieldname !== 'imageOfCourse') {
        // Ignorer silencieusement les autres champs de fichiers
        return cb(null, false);
    }
    
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
    } else {
        return cb(new Error('Seules les images sont autorisées'), false);
    }
};

// Configuration de Multer
const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('imageOfCourse'); // <-- Utilisation de .single() pour un seul champ spécifique

// Middleware pour gérer l'upload
const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreur de téléchargement de fichier',
                    error: err.message
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
        }
        next();
    });
};

router.get('/search/:id', courseController.getOnecourse);
router.get('/list', courseController.getcourses);
router.post('/add', handleUpload, courseController.createcourse); // <-- Utilisation du middleware personnalisé

module.exports = router;