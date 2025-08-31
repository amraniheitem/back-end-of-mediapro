const express = require('express')
const router = express.Router()
const controller = require('../controllers/conventionController')



router.route('/')
        .post(controller.createConvention)
        .get(controller.getAllConvention)

router.route('/:id')
        .delete(controller.deleteConvention)
        .get(controller.getOneConvention)
        .patch(controller.updateConvention);
        
module.exports=router