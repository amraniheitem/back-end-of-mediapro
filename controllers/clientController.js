const Client = require('../models/client')


const createClient = async (req,res)=>{
    try{
        const {Client} = req.body;
        const newClient = new Client({
            Client
        });
        const length = (await Client.find()).length
        newClient.id = length;
        await newClient.save()
        res.status(201).json({ success: true, message: 'Client added successfully', Client: newClient });
}catch (error) {
    
    res.status(500).json("error",error)
    
}}


const deleteClient = async (req, res) => {
    try {
        const ClientId = req.params.id;

        const Client = await Client.findById(ClientId);
        if (!Client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        await Client.findByIdAndDelete(ClientId);

        res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllClient = async (req, res) => {
    try {
        const Client = await Client.find(); 
        res.status(200).json(Client); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOneClient = async (req, res) => {
    try {
        const ClientId = req.params.id; 
        const Client = await Client.findById(ClientId); 
        if (!Client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(Client); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const ClientId = req.params.id;
        const updates = req.body;

        const Client = await Client.findByIdAndUpdate(ClientId, updates, { new: true });

        if (!Client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.status(200).json({ success: true, message: 'Client updated successfully', Client });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createClient,
    deleteClient,
    getAllClient,
    getOneClient,
    updateClient
};