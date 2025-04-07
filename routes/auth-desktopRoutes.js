const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-desktopController');

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
 