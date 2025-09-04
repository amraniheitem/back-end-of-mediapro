const Event = require('../models/services/event'); 

// Créer un event
const createEvent = async (req, res) => {
  try {
    const {
      titre,
      description,
      lieu,
      dateDebut,
      dateFin,
      heure,
      typeEvenement,
      prix,
      responsable,
      typeAnimateur,
      animateurNormal,
      animateurVip,
    } = req.body;

    // Logique: un seul type d'animateur
    let animateurNormalId = null;
    let animateurVipId = null;

    if (typeAnimateur === "normal") {
      animateurNormalId = animateurNormal;
    } else if (typeAnimateur === "vip") {
      animateurVipId = animateurVip;
    }

    const event = new Event({
      titre,
      description,
      lieu,
      dateDebut,
      dateFin,
      heure,
      typeEvenement,
      prix,
      responsable,
      typeAnimateur,
      animateurNormal: animateurNormalId,
      animateurVip: animateurVipId,
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Supprimer un event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const foundEvent = await Event.findById(eventId);
    if (!foundEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer tous les events
const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find(); 
    res.status(200).json(events); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

// Récupérer un seul event
const getOneEvent = async (req, res) => {
  try {
    const eventId = req.params.id; 
    const foundEvent = await Event.findById(eventId); 
    if (!foundEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(foundEvent); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event updated successfully', event: updatedEvent });
        
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  getAllEvent,
  getOneEvent,
  updateEvent
};
