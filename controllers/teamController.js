const Team = require('../models/services/team')


const createTeam = async (req,res)=>{
    try{
        const {Team} = req.body;
        const newTeam = new Team({
            Team
        });
        const length = (await Team.find()).length
        newTeam.id = length;
        await newTeam.save()
        res.status(201).json({ success: true, message: 'Team added successfully', Team: newTeam });
}catch (error) {
    
    res.status(500).json("error",error)
    
}}


const deleteTeam = async (req, res) => {
    try {
        const TeamId = req.params.id;

        const Team = await Team.findById(TeamId);
        if (!Team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        await Team.findByIdAndDelete(TeamId);

        res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllTeam = async (req, res) => {
    try {
        const Team = await Team.find(); 
        res.status(200).json(Team); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOneTeam = async (req, res) => {
    try {
        const TeamId = req.params.id; 
        const Team = await Team.findById(TeamId); 
        if (!Team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json(Team); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const TeamId = req.params.id;
        const updates = req.body;

        const Team = await Team.findByIdAndUpdate(TeamId, updates, { new: true });

        if (!Team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, message: 'Team updated successfully', Team });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createTeam,
    deleteTeam,
    getAllTeam,
    getOneTeam,
    updateTeam
};