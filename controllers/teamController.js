const Team = require('../models/services/team');

// CREATE
const createTeam = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune photo de profil téléchargée'
      });
    }

    const { nom, prenom, email, telephone, poste, cvUrl, portfolioUrl, motivation, status } = req.body;

    const newTeam = new Team({
      nom,
      prenom,
      email,
      telephone,
      poste,
      cvUrl,
      portfolioUrl,
      motivation,
      status,
      photoprofil: req.file.filename
    });

    await newTeam.save();

    res.status(201).json({
      success: true,
      message: 'Membre ajouté avec succès',
      data: newTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du membre",
      error: error.message
    });
  }
};

// DELETE
const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ success: true, message: 'Membre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// GET ALL
const getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getOneTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.photoprofil = req.file.filename; // mise à jour photo si fournie
    }

    const team = await Team.findByIdAndUpdate(teamId, updates, { new: true });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Membre mis à jour avec succès',
      data: team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  createTeam,
  deleteTeam,
  getAllTeam,
  getOneTeam,
  updateTeam
};
