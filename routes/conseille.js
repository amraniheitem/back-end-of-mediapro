const express = require('express')
const router = express.Router()
const controller = require('../controllers/conseilleController')



router.route('/')
        .post(controller.createConseille)
        .get(controller.getAllConseille)

router.route('/:id')
        .delete(controller.deleteConseille)
        .get(controller.getOneConseille)
        .patch(controller.updateConseille);
        
module.exports=router