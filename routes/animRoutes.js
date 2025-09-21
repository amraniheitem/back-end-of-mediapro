const express = require("express");
const router = express.Router();
const animController = require("../controllers/animController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { getCloudinaryStorage } = require('../utils/cloudinary');

// Storage sur Cloudinary
const upload = multer({
  storage: getCloudinaryStorage("animateurs"), // 👉 ton dossier Cloudinary
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// 📍 Ici le champ doit correspondre au `formData.append('photo_profil', file)` côté frontend
router.post("/add", upload.single("photo_profil"), animController.add);

router.get("/getAll", animController.getAll);
router.get("/getOne/:id", animController.getOne);
router.post("/update/:id", animController.update);
router.post("/suprimmer/:id", animController.deletes);
router.post("/:id/rate", authMiddleware, (req, res) => {
  animController.ratingAnimateur(req, res);
});

module.exports = router;
