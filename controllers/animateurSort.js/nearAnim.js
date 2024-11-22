const Animateur = require("../../models/animateur");
const User = require("../../models/user");
const wilayaCoordinates = {
    "Adrar": { lat: 27.87529, lon: -0.29388 },
    "Chlef": { lat: 36.16525, lon: 1.33452 },
    "Laghouat": { lat: 33.80039, lon: 2.86575 },
    "Oum El Bouaghi": { lat: 35.87533, lon: 7.11352 },
    "Batna": { lat: 35.55597, lon: 6.17414 },
    "Béjaïa": { lat: 36.75277, lon: 5.05589 },
    "Biskra": { lat: 34.85038, lon: 5.72805 },
    "Béchar": { lat: 31.61667, lon: -2.21667 },
    "Blida": { lat: 36.47004, lon: 2.82770 },
    "Bouira": { lat: 36.37489, lon: 3.90203 },
    "Tamanrasset": { lat: 22.785, lon: 5.5228 },
    "Tébessa": { lat: 35.40422, lon: 8.12436 },
    "Tlemcen": { lat: 34.87833, lon: -1.31667 },
    "Tiaret": { lat: 35.36667, lon: 1.31667 },
    "Tizi Ouzou": { lat: 36.71692, lon: 4.05028 },
    "Alger": { lat: 36.73225, lon: 3.08746 },
    "Djelfa": { lat: 34.66667, lon: 3.25 },
    "Jijel": { lat: 36.82055, lon: 5.76653 },
    "Sétif": { lat: 36.19112, lon: 5.41373 },
    "Saïda": { lat: 34.83033, lon: 0.15171 },
    "Skikda": { lat: 36.86688, lon: 6.90613 },
    "Sidi Bel Abbès": { lat: 35.20437, lon: -0.63051 },
    "Annaba": { lat: 36.90026, lon: 7.76584 },
    "Guelma": { lat: 36.46669, lon: 7.42821 },
    "Constantine": { lat: 36.365, lon: 6.61472 },
    "Médéa": { lat: 36.26408, lon: 2.75006 },
    "Mostaganem": { lat: 35.92708, lon: 0.08918 },
    "M'Sila": { lat: 35.70583, lon: 4.54194 },
    "Mascara": { lat: 35.39664, lon: 0.14027 },
    "Ouargla": { lat: 31.95000, lon: 5.33333 },
    "Oran": { lat: 35.69695, lon: -0.63385 },
    "El Bayadh": { lat: 33.68333, lon: 1.01667 },
    "Illizi": { lat: 26.48333, lon: 8.46667 },
    "Bordj Bou Arréridj": { lat: 36.07319, lon: 4.76027 },
    "Boumerdès": { lat: 36.76639, lon: 3.47717 },
    "El Tarf": { lat: 36.76791, lon: 8.31315 },
    "Tindouf": { lat: 27.67422, lon: -8.14731 },
    "Tissemsilt": { lat: 35.60722, lon: 1.81306 },
    "El Oued": { lat: 33.35631, lon: 6.86319 },
    "Khenchela": { lat: 35.43583, lon: 7.14333 },
    "Souk Ahras": { lat: 36.28750, lon: 7.95123 },
    "Tipaza": { lat: 36.58972, lon: 2.44972 },
    "Mila": { lat: 36.45194, lon: 6.26444 },
    "Aïn Defla": { lat: 36.26667, lon: 1.98333 },
    "Naâma": { lat: 33.26667, lon: -0.31667 },
    "Aïn Témouchent": { lat: 35.30307, lon: -1.13944 },
    "Ghardaïa": { lat: 32.48904, lon: 3.67346 },
    "Relizane": { lat: 35.73533, lon: 0.55598 }
};


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const toRad = (value) => (value * Math.PI) / 180; 

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const getNearestAnimateurs = async (req, res) => {
    const userId = req.params.userId; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const userWilaya = user.wilaya;
        const userCoordinates = wilayaCoordinates[userWilaya];
        if (!userCoordinates) {
            return res
                .status(400)
                .json({ message: "Les coordonnées pour la wilaya de l'utilisateur sont introuvables veuillez vérifiez dans la page des informations" });
        }

        const animateurList = await Animateur.find().select({
            nom: 1,
            prenom: 1,
            wilaya: 1,
            photo_profil: 1,
            video_presentatif: 1,
            ranking: 1,
        });

        if (!animateurList || animateurList.length === 0) {
            return res.status(404).json({ message: "Aucun animateur trouvé" });
        }

        const animateursWithDistance = animateurList.map((animateur) => {
            const animateurCoordinates = wilayaCoordinates[animateur.wilaya];
            if (!animateurCoordinates) {
                return null; 
            }
            const distance = calculateDistance(
                userCoordinates.lat,
                userCoordinates.lon,
                animateurCoordinates.lat,
                animateurCoordinates.lon
            );
            return { ...animateur.toObject(), distance };
        }).filter(Boolean); 

        const sortedAnimateurs = animateursWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedAnimateurs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des animateurs", error });
    }
};

module.exports = { getNearestAnimateurs };
