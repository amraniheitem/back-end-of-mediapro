const express = require('express')
const router = express.Router()
const controller = require('../controllers/promoController')



router.route('/')
        .post(controller.createPromo)
        .get(controller.getAllPromo)

router.route('/:id')
        .delete(controller.deletePromo)
        .get(controller.getOnePromo)
        .patch(controller.updatePromo);
        
module.exports=router