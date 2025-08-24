const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventController')



router.route('/')
        .post(controller.createEvent)
        .get(controller.getAllEvent)

router.route('/:id')
        .delete(controller.deleteEvent)
        .get(controller.getOneEvent)
        .patch(controller.updateEvent);
        
module.exports=router