const express = require('express');
const router = express.Router();
const animController = require('../controllers/animateurVip');
const nearAnim = require('../controllers/animateurSort.js/nearAnim');
const topAnim = require('../controllers/animateurSort.js/topAnim');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, 'uploads/animateurVip')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `animateur-${Date.now()}.${ext}`
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

router.get('/getAll', animController.getAll);
router.get('/getNear', nearAnim.getNearestAnimateurs);
router.get('/getOne/:id', animController.getOne);
router.post('/add', animController.add);
router.post('/update/:id', animController.update);
router.post('/suprimmer/:id', animController.deletes);
router.post('/:id/rate', authMiddleware, (req, res) => {
    console.log('User ID:', req.user.userId); 
    animController.ratingAnimateur(req, res);
});

module.exports = router;
