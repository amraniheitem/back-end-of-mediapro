const { Boutique } = require("../models/boutique");

// 📌 Créer une boutique
const createBoutique = async (req, res) => {
  try {
    const boutique = new Boutique(req.body);
    const savedBoutique = await boutique.save();
    res.status(201).json({
      success: true,
      message: "Boutique créée avec succès",
      data: savedBoutique,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📌 Récupérer toutes les boutiques
const getBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.status(200).json({ success: true, data: boutiques });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Récupérer une seule boutique par ID
const getBoutiqueById = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.id);
    if (!boutique) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée" });
    }
    res.status(200).json({ success: true, data: boutique });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Mettre à jour une boutique
const updateBoutique = async (req, res) => {
  try {
    const updatedBoutique = await Boutique.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBoutique) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée" });
    }
    res.status(200).json({
      success: true,
      message: "Boutique mise à jour avec succès",
      data: updatedBoutique,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📌 Supprimer une boutique
const deleteBoutique = async (req, res) => {
  try {
    const deleted = await Boutique.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée" });
    }
    res.status(200).json({ success: true, message: "Boutique supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createBoutique,
  getBoutiques,
  getBoutiqueById,
  updateBoutique,
  deleteBoutique,
};
