// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/usermanage");
const register = require("../controllers/auth-desktopController");

router.get("/users", auth, isAdmin, adminController.getAllUsers);
router.post("/users", auth, isAdmin, register.register);
router.put("/users/:id/role", auth, isAdmin, adminController.updateUserRole);
router.delete("/users/:id", auth, isAdmin, adminController.deleteUser);

module.exports = router;
