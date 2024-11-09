const express = require('express');
const router = express.Router();
const authController = require('../controllers/cateCourseController');

router.get('/list', authController.getCategories);
router.get('/getOne/:id', authController.getOneCategory);
router.post('/add', authController.createCategory); 


module.exports = router;
