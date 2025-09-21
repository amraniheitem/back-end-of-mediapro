const Course = require('../models/course');

// ➕ Créer un cours
const createcourse = async (req, res) => {
    try {
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
            imageOfCourse: req.file.path || req.file.filename // ✅ Cloudinary => path
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

// 📋 Obtenir tous les cours
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

// 🔍 Obtenir un seul cours
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

// ✏️ Mettre à jour un cours
const updatecourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé'
            });
        }

        // Si nouvelle image => remplacer
        if (req.file) {
            course.imageOfCourse = req.file.path || req.file.filename;
        }

        // Mettre à jour les autres champs
        course.name_of_course = req.body.name_of_course || course.name_of_course;
        course.name_of_formator = req.body.name_of_formator || course.name_of_formator;
        course.description = req.body.description || course.description;
        course.link = req.body.link || course.link;
        course.category = req.body.category || course.category;
        course.price = req.body.price || course.price;
        course.counter_of_ins = req.body.counter_of_ins || course.counter_of_ins;
        course.isDisplay = req.body.isDisplay !== undefined ? req.body.isDisplay : course.isDisplay;

        const updatedCourse = await course.save();

        res.status(200).json({
            success: true,
            message: 'Cours mis à jour avec succès',
            data: updatedCourse
        });
    } catch (error) {
        console.error("Erreur mise à jour cours:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 🗑️ Supprimer un cours
const deletecourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cours supprimé avec succès'
        });
    } catch (error) {
        console.error("Erreur suppression cours:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createcourse,
    getcourses,
    getOnecourse,
    updatecourse,
    deletecourse
};
