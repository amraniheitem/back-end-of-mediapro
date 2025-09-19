const User = require("../models/user-desktop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEMail");
const { generateAccessToken } = require("../utils/generateToken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const verify2FA = require("../utils/verify2FA");

require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { nom, prenom, cin, email, telephone, wilaya, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      nom, prenom, cin, email, telephone, wilaya,
      password: hashedPassword, role: role || "user"
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password, code2FA } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    // si 2FA activé, vérifier code (implémentation verify2FA non fournie ici)
    if (user.twoFactorEnabled) {
      if (!code2FA) return res.status(401).json({ message: "Code 2FA requis" });
      // vérification 2FA: à ajouter si tu utilises speakeasy
    }

    const token = generateAccessToken(user);
    res.json({ message: "Connexion réussie", token, user });
  } catch (error) {
    res.status(500).json({ message: "Erreur login", error: error.message });
  }
};

// ---------- 1) Route pour demander le code OR vérifier le code ----------
// POST /authdesktop/forgot-password/:userId
// - si body vide => on génère et on envoie le code (OTP) vers l'email de l'utilisateur
// - si body contient { code } => on vérifie le code (et marque resetPasswordVerified = true)
exports.forgotPasswordOrVerify = async (req, res) => {
  try {
    const { userId } = req.params;
    const { code } = req.body || {};

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    if (!user.email) return res.status(400).json({ message: "Aucun email associé à cet utilisateur" });

    // --- si pas de code : on génère et on envoie ---
    if (!code) {
      // anti-spam : si code déjà envoyé et non-expiré => refuser
      if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
        const msLeft = user.resetPasswordExpires - Date.now();
        const minutes = Math.ceil(msLeft / 60000);
        return res.status(429).json({ message: `Code déjà envoyé. Réessaye dans ${minutes} minute(s).` });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
      user.resetPasswordToken = resetCode;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
      user.resetPasswordVerified = false;
      await user.save();

      const subject = "Code de réinitialisation de mot de passe";
      const text = `Bonjour ${user.nom},\n\nVotre code de réinitialisation est : ${resetCode}\nIl est valable 15 minutes.`;

      try {
        await sendEmail(user.email, subject, text);
      } catch (mailErr) {
        console.error("Erreur envoi mail (ignored):", mailErr);
      }

      // pour debug local : si tu veux voir le code dans Postman, active DEBUG_RESET env = 'true'
      if (process.env.DEBUG_RESET === "true") {
        return res.json({ message: "Code envoyé (DEBUG)", code: resetCode });
      }
      return res.json({ message: "Code envoyé à l'email associé" });
    }

    // --- si on reçoit un code : on vérifie ---
    if (code) {
      if (!user.resetPasswordToken || user.resetPasswordToken !== code) {
        return res.status(400).json({ message: "Code invalide" });
      }
      if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: "Code expiré" });
      }

      // tout est OK : marquer comme vérifié (autorise la route reset-forgot-password)
      user.resetPasswordVerified = true;
      // (optionnel) on réduit la fenêtre de temps pour reset après vérif
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes supplémentaires pour reset
      await user.save();

      return res.json({ message: "Code valide — vous pouvez maintenant définir un nouveau mot de passe." });
    }

    // fallback
    return res.status(400).json({ message: "Paramètres invalides" });
  } catch (error) {
    console.error("forgotPasswordOrVerify error:", error);
    return res.status(500).json({ message: "Erreur forgot-password", error: error.message });
  }
};

// ---------- 2) Reset (après vérification du code) ----------
// POST /authdesktop/reset-forgot-password/:userId  body { newPassword }
exports.resetForgotPasswordById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "Nouveau mot de passe requis" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (!user.resetPasswordVerified) {
      return res.status(403).json({ message: "Code non vérifié — utilisez la route forgot-password pour vérifier le code d'abord" });
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Session expirée — redemandez un code" });
    }

    // tout va bien : changer le mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.resetPasswordVerified = false;
    await user.save();

    return res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("resetForgotPasswordById error:", error);
    return res.status(500).json({ message: "Erreur reset-forgot-password", error: error.message });
  }
};

// ---------- 3) Changer le mot de passe quand on connaît l'ancien (auth requise) ----------
// POST /authdesktop/reset-password/:userId  body { oldPassword, newPassword }
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Ancien et nouveau mot de passe requis" });
    }

    // sécurité : seul l'utilisateur lui-même ou un admin peut changer via cette route
    if (!req.user) return res.status(401).json({ message: "Authentification requise" });
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Mot de passe changé avec succès" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Erreur reset-password", error: error.message });
  }
};

// ✅ Activer 2FA
exports.enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const secret = speakeasy.generateSecret({ name: `MediaPro (${user.email})` });
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ message: "2FA activée", qrCodeUrl, secret: secret.base32 });
  } catch (error) {
    res.status(500).json({ message: "Erreur enable 2FA", error: error.message });
  }
};

// ✅ Désactiver 2FA
exports.disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ message: "2FA désactivée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur disable 2FA", error: error.message });
  }
};
