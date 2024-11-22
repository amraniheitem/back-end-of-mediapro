const Animateur = require("../../models/animateur");

const topAnimateur = async (req, res) => {
    try {
        const animateurs = await Animateur.find()
            .select({ nom: 1, prenom: 1, ranking: 1, event: 1, photo_profil: 1 })
            .sort({ ranking: -1 }) 
            .limit(3); 

        if (!animateurs || animateurs.length === 0) {
            return res.status(404).json({ message: "Aucun animateur trouvé" });
        }

        res.status(200).json(animateurs); 
    } catch (error) {
        console.error("Erreur lors de la récupération des animateurs :", error);
        res.status(500).json({ message: "Erreur interne", error });
    }
};

module.exports = { topAnimateur };
