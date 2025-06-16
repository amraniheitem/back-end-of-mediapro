const express = require('express');
const router = express.Router();
const animController = require('../controllers/animController');
const nearAnim = require('../controllers/animateurSort.js/nearAnim');
const topAnim = require('../controllers/animateurSort.js/topAnim');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuration de stockage
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/animateur');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `animateur-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// Middleware de filtre de type de fichier
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialisation de multer
const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
});

// 📍 Assure-toi d'utiliser le même nom de champ ici :
router.post('/add', upload.single('photo_profil'), animController.add);

router.get('/getAll', animController.getAll);
router.get('/getNear', nearAnim.getNearestAnimateurs);
router.get('/getOne/:id', animController.getOne);
router.post('/update/:id', animController.update);
router.post('/suprimmer/:id', animController.deletes);
router.post('/:id/rate', authMiddleware, (req, res) => {
    animController.ratingAnimateur(req, res);
});

module.exports = router;
