const express = require('express');
const router = express.Router();
const controller = require('../controllers/teamController');

const multer = require('multer');
const path = require('path');

// Config stockage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/team');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `team-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Filtre fichiers
const fileFilter = (req, file, cb) => {
  if (file.fieldname !== 'photoprofil') {
    return cb(null, false);
  }
  
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    return cb(new Error('Seules les images sont autorisées'), false);
  }
};

// Upload config
const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('photoprofil');

// Middleware upload
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

// Routes
router.route('/')
  .post(handleUpload, controller.createTeam)
  .get(controller.getAllTeam);

router.route('/:id')
  .delete(controller.deleteTeam)
  .get(controller.getOneTeam)
  .patch(handleUpload, controller.updateTeam);

module.exports = router;
