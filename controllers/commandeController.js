const Order = require('../models/commande');
const Animateur = require('../models/animateur');
const Voix = require('../models/voix');
const Product = require('../models/product');
const Course = require('../models/course');

exports.createOrder = async (req, res) => {
    try {
        const { userId, type, details, phone, email, adresse, ville } = req.body;

        let specificDetails = {};
        switch (type) {
            case 'ANIMATEUR':
                specificDetails = {
                    animateurId: details.animateurId,
                    date: details.date,
                    eventType: details.eventType,
                    eventDate: details.eventDate,
                    eventHeure: details.eventHeure,
                    eventLieu: details.eventLieu
                };
                break;
            case 'VOICEOVER':
                specificDetails = {
                    voiceoverId: details.voiceoverId,
                    videoDuration: details.videoDuration,
                    eventType: details.eventType
                };
                break;
            case 'COURS':
                specificDetails = {
                    courseId: details.courseId,
                    courseDetails: details.courseDetails,
                    Niveau: details.Niveau
                };
                break;
            case 'PRODUIT':
                specificDetails = {
                    produitId: details.produitId,
                    quantity: details.quantity
                };
                break;
            default:
                return res.status(400).json({ message: 'Type de commande invalide' });
        }

        const newOrder = new Order({
            userId,
            type,
            details: specificDetails,
            phone,
            email,
            ville,
            adresse
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.status(200).json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
