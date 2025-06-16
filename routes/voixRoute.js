const express = require('express');
const router = express.Router();
const voixController = require('../controllers/voixController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// CONFIGURATION DU DISKSTORAGE MULTER
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/voix');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `voix-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

// FILTRE IMAGE SEULEMENT
const upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
        const filetype = file.mimetype.split('/')[0];
        if (filetype === "image") {
            return cb(null, true);
        } else {
            return cb(new Error("Le fichier doit être une image"), false);
        }
    }
});

// ROUTES
router.get('/getAll', voixController.getAll);
router.get('/getOne/:id', voixController.getOne);
router.post('/add', upload.single('photo_profil'), voixController.add);
router.post('/update/:id', voixController.update);
router.post('/suprimmer/:id', voixController.deletes);
router.post('/:id/rate', authMiddleware, (req, res) => {
    voixController.ratingVoix(req, res);
});

module.exports = router;
