const Conseille = require('../models/conseille')


const createConseille = async (req,res)=>{
    try{
        const {Conseille} = req.body;
        const newConseille = new Conseille({
            Conseille
        });
        const length = (await Conseille.find()).length
        newConseille.id = length;
        await newConseille.save()
        res.status(201).json({ success: true, message: 'Conseille added successfully', Conseille: newConseille });
}catch (error) {
    
    res.status(500).json("error",error)
    
}}


const deleteConseille = async (req, res) => {
    try {
        const ConseilleId = req.params.id;

        const Conseille = await Conseille.findById(ConseilleId);
        if (!Conseille) {
            return res.status(404).json({ success: false, message: 'Conseille not found' });
        }
        await Conseille.findByIdAndDelete(ConseilleId);

        res.status(200).json({ success: true, message: 'Conseille deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllConseille = async (req, res) => {
    try {
        const Conseille = await Conseille.find(); 
        res.status(200).json(Conseille); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOneConseille = async (req, res) => {
    try {
        const ConseilleId = req.params.id; 
        const Conseille = await Conseille.findById(ConseilleId); 
        if (!Conseille) {
            return res.status(404).json({ message: 'Conseille not found' });
        }

        res.status(200).json(Conseille); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateConseille = async (req, res) => {
    try {
        const ConseilleId = req.params.id;
        const updates = req.body;

        const Conseille = await Conseille.findByIdAndUpdate(ConseilleId, updates, { new: true });

        if (!Conseille) {
            return res.status(404).json({ success: false, message: 'Conseille not found' });
        }
        res.status(200).json({ success: true, message: 'Conseille updated successfully', Conseille });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createConseille,
    deleteConseille,
    getAllConseille,
    getOneConseille,
    updateConseille
};