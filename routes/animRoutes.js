const express = require('express');
const router = express.Router();
const voixController = require('../controllers/voixController');
const nearAnim = require('../controllers/animateurSort.js/nearAnim');
const topAnim = require('../controllers/animateurSort.js/topAnim');
const multer = require('multer');


const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, 'uploads/voix')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `product-${Date.now()}.${ext}`
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

router.get('/getAll', voixController.getAll);
router.get('/getNear', nearAnim.getNearestAnimateurs);
router.get('/getOne/:id', voixController.getOne);
router.post('/add',upload.single('photo_profil'), voixController.add);
router.post('/update/:id', voixController.update);
router.post('/suprimmer/:id', voixController.deletes);


module.exports = router;
