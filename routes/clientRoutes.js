const express = require('express')
const router = express.Router()
const controller = require('../controllers/clientController')



router.route('/')
        .post(controller.createClient)
        .get(controller.getAllClient)

router.route('/:id')
        .delete(controller.deleteClient)
        .get(controller.getOneClient)
        .patch(controller.updateClient);
        
module.exports=router