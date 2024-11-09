const express = require('express');
const router = express.Router();
const animController = require('../controllers/animController');

router.get('/getAll', animController.getAll);
router.get('/getOne/:id', animController.getOne);
router.post('/add', animController.add);
router.post('/update/:id', animController.update);
router.post('/suprimmer/:id', animController.deletes);


module.exports = router;
