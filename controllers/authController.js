const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const secret = process.env.SECRET; // Correction : SECRET en majuscules pour suivre la convention .env

// 📩 Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔢 Fonction pour générer un code de vérification à 6 chiffres
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// 📩 Fonction pour envoyer un email de vérification
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Votre code de vérification",
    text: `Votre code de vérification est : ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Échec de l'envoi de l'email");
  }
};

// 📌 Enregistrement des informations personnelles
const info_register = async (req, res) => {
  try {
    const { nom, prénom, date, numéro, wilaya } = req.body;

    const newUser = new User({ nom, prénom, date, numéro, wilaya });
    await newUser.save();

    res.status(201).json({ message: "Informations personnelles enregistrées", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: err.message });
  }
};

// 📌 Création du compte + Envoi du code de vérification
const account_register = async (req, res) => {
  try {
    const { email, password, confirmed_password } = req.body;
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (user.email) return res.status(400).json({ message: "Compte déjà créé avec cet email" });
    if (password !== confirmed_password) return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    user.email = email;
    user.password = hashedPassword;
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expiration dans 10 minutes

    await user.save();

    // 🔥 Envoi du code de vérification par email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "Compte créé, vérifiez votre email pour confirmer", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: err.message });
  }
};

// 📌 Vérification du code
const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (!user.verificationCode) {
      return res.status(400).json({ message: "Aucun code à vérifier, veuillez recommencer l'inscription" });
    }

    if (user.verificationCode !== code) {
      await User.findByIdAndDelete(userId);
      return res.status(400).json({ message: "Code incorrect, compte supprimé" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      await User.findByIdAndDelete(userId);
      return res.status(400).json({ message: "Code expiré, compte supprimé" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Email vérifié avec succès, vous pouvez vous connecter" });
  } catch (err) {
    await User.findByIdAndDelete(req.params.userId);
    res.status(500).json({ message: "Erreur lors de la vérification, compte supprimé", error: err.message });
  }
};

// 📌 Connexion de l'utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (!user.isVerified) return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe invalide" });

    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: err.message });
  }
};

module.exports = { info_register, account_register, verifyCode, login };
