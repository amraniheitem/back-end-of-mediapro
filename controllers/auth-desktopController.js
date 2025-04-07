const Userdesktop = require("../models/user-desktop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { nom, prénom, numéro, numéro_carte, email, password } = req.body;

        const existingUser = await Userdesktop.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Userdesktop({
            nom,
            prénom,
            numéro,
            numéro_carte,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Utilisateur enregistré avec succès" });
    } catch (error) {
        console.log("Erreur dans register:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Userdesktop.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1d" });

        res.status(200).json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

module.exports = { register, login };
