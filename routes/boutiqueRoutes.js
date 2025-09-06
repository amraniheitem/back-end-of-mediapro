const express = require("express");
const router = express.Router();
const {
  createBoutique,
  getBoutiques,
  getBoutiqueById,
  updateBoutique,
  deleteBoutique,
} = require("../controllers/boutiqueController");

// CRUD Boutiques
router.post("/", createBoutique);       // Ajouter une boutique
router.get("/", getBoutiques);          // Récupérer toutes les boutiques
router.get("/:id", getBoutiqueById);    // Récupérer une boutique par ID
router.put("/:id", updateBoutique);     // Mettre à jour une boutique
router.delete("/:id", deleteBoutique);  // Supprimer une boutique

module.exports = router;
