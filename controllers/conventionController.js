const Convention = require('../models/convention');

// ➕ Créer un Convention
const createConvention = async (req, res) => {
  try {
    const newConvention = new Convention(req.body);
    await newConvention.save();

    res.status(201).json({
      success: true,
      message: 'Convention added successfully',
      data: newConvention
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating Convention',
      error: error.message
    });
  }
};

// ❌ Supprimer un Convention
const deleteConvention = async (req, res) => {
  try {
    const ConventionId = req.params.id;

    const Convention = await Convention.findByIdAndDelete(ConventionId);
    if (!Convention) {
      return res.status(404).json({ success: false, message: 'Convention not found' });
    }

    res.status(200).json({ success: true, message: 'Convention deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// 📜 Récupérer tous les Conventions
const getAllConvention = async (req, res) => {
  try {
    const Conventions = await Convention.find();
    res.status(200).json(Conventions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Récupérer un seul Convention
const getOneConvention = async (req, res) => {
  try {
    const ConventionId = req.params.id;
    const Convention = await Convention.findById(ConventionId);

    if (!Convention) {
      return res.status(404).json({ success: false, message: 'Convention not found' });
    }

    res.status(200).json(Convention);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Mettre à jour un Convention
const updateConvention = async (req, res) => {
  try {
    const ConventionId = req.params.id;
    const updates = req.body;

    const updatedConvention = await Convention.findByIdAndUpdate(ConventionId, updates, { new: true });

    if (!updatedConvention) {
      return res.status(404).json({ success: false, message: 'Convention not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Convention updated successfully',
      data: updatedConvention
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createConvention,
  deleteConvention,
  getAllConvention,
  getOneConvention,
  updateConvention
};
