const Event = require('../models/services/event')


const createEvent = async (req,res)=>{
    try{
        const {Event} = req.body;
        const newEvent = new Event({
            Event
        });
        const length = (await Event.find()).length
        newEvent.id = length;
        await newEvent.save()
        res.status(201).json({ success: true, message: 'Event added successfully', Event: newEvent });
}catch (error) {
    
    res.status(500).json("error",error)
    
}}


const deleteEvent = async (req, res) => {
    try {
        const EventId = req.params.id;

        const Event = await Event.findById(EventId);
        if (!Event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        await Event.findByIdAndDelete(EventId);

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllEvent = async (req, res) => {
    try {
        const Event = await Event.find(); 
        res.status(200).json(Event); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOneEvent = async (req, res) => {
    try {
        const EventId = req.params.id; 
        const Event = await Event.findById(EventId); 
        if (!Event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(Event); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const EventId = req.params.id;
        const updates = req.body;

        const Event = await Event.findByIdAndUpdate(EventId, updates, { new: true });

        if (!Event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, message: 'Event updated successfully', Event });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createEvent,
    deleteEvent,
    getAllEvent,
    getOneEvent,
    updateEvent
};