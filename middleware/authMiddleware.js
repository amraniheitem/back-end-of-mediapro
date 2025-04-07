const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Récupération du header Authorization
    const authHeader = req.headers.authorization;
    
    // Vérification du format Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Format d'authentification invalide"
        });
    }

    // Extraction du token
    const token = authHeader.split(' ')[1];

    try {
        // Vérification et décodage avec HS256
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });

        // Stockage des informations utilisateur
        req.user = {
            userId: decoded.userId, // ID récupéré du payload JWT
            role: decoded.role
        };

        next();
    } catch (error) {
        // Gestion des erreurs spécifiques
        let message = "Erreur d'authentification";
        
        if (error.name === 'TokenExpiredError') {
            message = "Token expiré";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Token invalide";
        }

        res.status(401).json({
            success: false,
            message: message,
            error: error.message
        });
    }
};

module.exports = authMiddleware;