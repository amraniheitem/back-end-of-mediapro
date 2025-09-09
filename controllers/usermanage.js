// controllers/adminController.js
const User = require("../models/user-desktop");
const bcrypt = require("bcryptjs");

// 🔸 Lister tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // pas de mdp
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération utilisateurs" });
  }
};


// 🔸 Modifier le rôle d’un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Rôle mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur modification rôle" });
  }
};

// 🔸 Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression utilisateur" });
  }
};
