const express = require('express');
const router = express.Router();
const authController = require('../controllers/CourseController');

router.get('/search/:id',authController.getOneCourse);
router.get('/list', authController.getCourses);
router.post('/add', authController.CreateCourse); 

module.exports = router;
