const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const secret = process.env.secret; 

const info_register = async (req, res) => {
  try {
    const { nom, prénom, date, numéro } = req.body;

    const newUser = new User({ nom, prénom, date, numéro });
    await newUser.save();

    res.status(201).json({ message: 'Informations personnelles enregistrées', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: err.message });
  }
};

const account_register = async (req, res) => {
  try {
    const { email, password, confirmed_password } = req.body;
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.email) {
      return res.status(400).json({ message: 'Compte déjà créé avec cet email' });
    }

    // Vérification que le mot de passe et la confirmation sont identiques
    if (password !== confirmed_password) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    user.email = email;
    user.password = hashedPassword;  

    await user.save();

    res.status(201).json({ message: 'Compte créé, vérifiez votre email pour confirmer' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: err.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};



module.exports = { info_register, account_register, login };
