const express = require('express')
const router = express.Router()
const controller = require('../controllers/teamController')



router.route('/')
        .post(controller.createTeam)
        .get(controller.getAllTeam)

router.route('/:id')
        .delete(controller.deleteTeam)
        .get(controller.getOneTeam)
        .patch(controller.updateTeam);
        
module.exports=router