const Promo = require('../models/services/promo')


const createPromo = async (req,res)=>{
    try{
        const {Promo} = req.body;
        const newPromo = new Promo({
            Promo
        });
        const length = (await Promo.find()).length
        newPromo.id = length;
        await newPromo.save()
        res.status(201).json({ success: true, message: 'Promo added successfully', Promo: newPromo });
}catch (error) {
    
    res.status(500).json("error",error)
    
}}


const deletePromo = async (req, res) => {
    try {
        const PromoId = req.params.id;

        const Promo = await Promo.findById(PromoId);
        if (!Promo) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }
        await Promo.findByIdAndDelete(PromoId);

        res.status(200).json({ success: true, message: 'Promo deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllPromo = async (req, res) => {
    try {
        const Promo = await Promo.find(); 
        res.status(200).json(Promo); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOnePromo = async (req, res) => {
    try {
        const PromoId = req.params.id; 
        const Promo = await Promo.findById(PromoId); 
        if (!Promo) {
            return res.status(404).json({ message: 'Promo not found' });
        }

        res.status(200).json(Promo); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePromo = async (req, res) => {
    try {
        const PromoId = req.params.id;
        const updates = req.body;

        const Promo = await Promo.findByIdAndUpdate(PromoId, updates, { new: true });

        if (!Promo) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }
        res.status(200).json({ success: true, message: 'Promo updated successfully', Promo });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createPromo,
    deletePromo,
    getAllPromo,
    getOnePromo,
    updatePromo
};