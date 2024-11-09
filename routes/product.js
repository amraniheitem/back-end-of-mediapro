const express = require('express');
const router = express.Router();
const authController = require('../controllers/productController');
const multer = require('multer');

router.get('/search/:id',authController.getOneProduct);
router.get('/list', authController.getProducts);
router.post('/add', authController.createProduct); 

module.exports = router;
