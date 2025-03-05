const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // L'utilisateur qui passe la commande
  type: { 
    type: String, 
    enum: ['ANIMATEUR', 'VOICEOVER', 'COURS', 'PRODUIT'], 
    required: true 
  },
  details: {
    animateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animateur' },
    voiceoverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voix' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    date: { type: Date }, 
    eventType: { type: String }, 
    eventDate: { type: String }, 
    eventHeure: { type: String }, 
    eventLieu: { type: String }, 
    videoDuration: { type: Number }, 
    videoLanguage: { type: String }, 
    courseDetails: { type: String }, 
    Niveau: { type: String , enum : ['Débutant', 'Intermédiaire', 'Expert'] }, 
    quantity: { type: Number, default: 1 } 
  },
  phone: { type: String, required: true },
  email: { type: String, required: true }, 
  adresse: { type: String, required: true }, 
  ville: { type: String, required: true }, 
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' }, 
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
 
