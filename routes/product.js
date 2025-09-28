const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const { getCloudinaryStorage } = require('../utils/cloudinary');

// ⚡ Multer avec Cloudinary (dossier MediaPro/product)
const upload = multer({
  storage: getCloudinaryStorage('product'),
  limits: { fileSize: 5 * 1024 * 1024 } // max 5 Mo
}).single('images'); // ✅ doit correspondre au champ du frontend

// 🎯 Middleware pour gérer les erreurs d’upload
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

// 🔍 Chercher un produit par ID
router.get('/search/:id', productController.getOneProduct);

// 📋 Liste de produits
router.get('/list', productController.getProducts);

// ➕ Ajouter un produit avec image (Cloudinary)
router.post('/add', handleUpload, productController.createProduct);

// ✏️ Mettre à jour un produit (si nouvelle image, Cloudinary remplace)
router.patch('/update/:id', handleUpload, productController.updateProduct);

// 🗑️ Supprimer un produit
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
