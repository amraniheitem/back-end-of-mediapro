const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

router.get('/list', commandeController.getAllOrders);
router.get('/getOne/:id', commandeController.getOrderById);
router.post('/add', commandeController.createOrder); 
router.delete('/delete/:id', commandeController.deleteOrder); 


module.exports = router;
