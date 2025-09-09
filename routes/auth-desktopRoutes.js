const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-desktopController");
const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// forgot-password (générer OU vérifier le code) -> POST /forgot-password/:userId
router.post("/forgot-password/:userId", authController.forgotPasswordOrVerify);

// reset after forgot (après vérification du code) -> POST /reset-forgot-password/:userId
router.post("/reset-forgot-password/:userId", authController.resetForgotPasswordById);

// change password when user knows old password -> POST /reset-password/:userId (auth required)
router.post("/reset-password/:userId", auth, authController.changePassword);

// 2FA
router.post("/enable-2fa", auth, authController.enable2FA);
router.post("/disable-2fa", auth, authController.disable2FA);

module.exports = router;
