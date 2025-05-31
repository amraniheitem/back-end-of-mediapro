const express = require('express');
const router = express.Router();
const authController = require('../controllers/CourseController');
const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, 'uploads/course')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `course-${Date.now()}.${ext}`
        cb(null,filename)
    }
})
const upload = multer({ storage: diskStorage ,
fileFilter: (req,file,cb)=>{
    const filetype = file.mimetype.split('/')[0];
    if(filetype === "image"){
        return cb(null,true);
    }
    else{
        return cb(AppError.create("file must be image",400,httpStatusText.FAIL),false);
    }
}})

router.get('/search/:id',authController.getOneCourse);
router.get('/list', authController.getCourses);
router.post('/add', authController.CreateCourse); 

module.exports = router;
