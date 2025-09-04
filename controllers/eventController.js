const Event = require('../models/services/event'); 

// Créer un event
const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event added successfully',
      event: newEvent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
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
