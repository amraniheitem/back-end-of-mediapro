const Course = require('../models/course');

const createcourse = async (req, res) => {
    try {
        // Vérifier si le fichier a été téléchargé
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune image téléchargée'
            });
        }

        const course = new Course({
            name_of_course: req.body.name_of_course,
            name_of_formator: req.body.name_of_formator,
            description: req.body.description,
            link: req.body.link,
            category: req.body.category,
            price: req.body.price,
            counter_of_ins: req.body.counter_of_ins || 0,
            isDisplay: req.body.isDisplay || false,
            imageOfCourse: req.file.filename
        });

        const savedCourse = await course.save();
        
        res.status(201).json({
            success: true,
            data: savedCourse
        });
        
    } catch (error) {
        console.error("Erreur création cours:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getcourses = async (req, res) => {
    try {
        const courseList = await Course.find().populate('category');
        res.status(200).json({
            success: true,
            data: courseList
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getOnecourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('category');
        
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Cours non trouvé' 
            });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur récupération cours', 
            error: error.message 
        });
    }
};

module.exports = {
    createcourse,
    getcourses,
    getOnecourse
};