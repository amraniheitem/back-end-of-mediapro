const Animateur = require("../models/animateur");
const mongoose = require('mongoose');


const getAll = async (req, res) =>{
    

    const animateurList = await Animateur.find().select({ nom: 1, prenom: 1, wilaya: 1 });

    if(!animateurList) {
        res.status(500).json({success: false})
    } 
    res.send(animateurList);
}
const getOne = async (req, res) => {
    try {
        const animateur = await Animateur.findById(req.params.id);

        if (!animateur) {
            return res.status(404).json({ success: false, message: "Animateur non trouvé" });
        }

        res.send(animateur);
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
}


    const add = async (req, res) => {
        try {
            let animateur = new Animateur({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                numero: req.body.numero,
                sex: req.body.sex,
                niveau: req.body.niveau,
                wilaya: req.body.wilaya,
                adresse: req.body.adresse,
                numero_carte: req.body.numero_carte,
            });
    
            // Sauvegarder l'instance d'animateur
            animateur = await animateur.save();
    
            if (!animateur) {
                return res.status(500).send("animateur n'est pas créé");
            }
    
            res.send(animateur);
        } catch (err) {
            res.status(500).send("Erreur serveur");
        }
    }


    const update = async (req, res) => {
        // Vérification de la validité de l'ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('ID de l\'animateur invalide');
        }
    
        try {
            // Vérification si l'animateur existe
            const animateur = await Animateur.findById(req.params.id);
            if (!animateur) {
                return res.status(400).send('Animateur non trouvé');
            }
    
            // Mise à jour de l'animateur
            const nouveau_animateur = await Animateur.findByIdAndUpdate(
                req.params.id,
                {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    numero: req.body.numero,
                    sex: req.body.sex,
                    niveau: req.body.niveau,
                    wilaya: req.body.wilaya,
                    adresse: req.body.adresse,
                    numero_carte: req.body.numero_carte,
                },
                { new: true } // Cette option renvoie le document mis à jour
            );
    
            if (!nouveau_animateur) {
                return res.status(500).send('L\'animateur n\'a pas pu être mis à jour');
            }
    
            // Renvoi de l'animateur mis à jour
            res.send(nouveau_animateur);
        } catch (error) {
            // Gestion des erreurs
            res.status(500).json({ success: false, message: error.message });
        }
    }
    

    const deletes = async (req, res) => {
        // Vérification de la validité de l'ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('ID de l\'animateur invalide');
        }
    
        try {
            const animateur = await Animateur.findByIdAndDelete(req.params.id);
    
            if (animateur) {
                return res.status(200).json({ success: true, message: 'L\'animateur est supprimé!' });
            } else {
                return res.status(404).json({ success: false, message: 'Animateur non trouvé!' });
            }
        } catch (err) {
            return res.status(500).json({ success: false, error: err });
        }
    }
    



module.exports = { getAll ,getOne, add , update , deletes };
