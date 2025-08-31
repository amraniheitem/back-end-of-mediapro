const Client = require('../models/client');

// ➕ Créer un client
const createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Client added successfully',
      data: newClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

// ❌ Supprimer un client
const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// 📜 Récupérer tous les clients
const getAllClient = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Récupérer un seul client
const getOneClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Mettre à jour un client
const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updates = req.body;

    const updatedClient = await Client.findByIdAndUpdate(clientId, updates, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createClient,
  deleteClient,
  getAllClient,
  getOneClient,
  updateClient
};
