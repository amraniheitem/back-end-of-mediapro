const Promo = require('../models/services/promo');

// CREATE
const createPromo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image téléchargée'
      });
    }

    // Récupérer les champs envoyés
    const { titre, description, reduction, dateDebut, dateFin, actif, image } = req.body;

    const newPromo = new Promo({
      titre,
      description,
      reduction,
      dateDebut,
      dateFin,
      actif,
      image: req.file.filename
    });

    await newPromo.save();

    res.status(201).json({
      success: true,
      message: 'Promo ajoutée avec succès',
      data: newPromo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout",
      error: error.message
    });
  }
};

// DELETE
const deletePromo = async (req, res) => {
  try {
    const promoId = req.params.id;

    const promo = await Promo.findById(promoId);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo non trouvée' });
    }

    await Promo.findByIdAndDelete(promoId);

    res.status(200).json({ success: true, message: 'Promo supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// GET ALL
const getAllPromo = async (req, res) => {
  try {
    const promos = await Promo.find(); 
    res.status(200).json(promos); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

// GET ONE
const getOnePromo = async (req, res) => {
  try {
    const promoId = req.params.id; 
    const promo = await Promo.findById(promoId); 
    if (!promo) {
      return res.status(404).json({ message: 'Promo non trouvée' });
    }

    res.status(200).json(promo); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updatePromo = async (req, res) => {
  try {
    const promoId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.filename; // mise à jour de l'image si fournie
    }

    const promo = await Promo.findByIdAndUpdate(promoId, updates, { new: true });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo non trouvée' });
    }
    res.status(200).json({ success: true, message: 'Promo mise à jour avec succès', data: promo });
        
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  createPromo,
  deletePromo,
  getAllPromo,
  getOnePromo,
  updatePromo
};
