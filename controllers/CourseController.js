
const { Course } = require('../models/course');
const { Category } = require('../models/category_course');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
};

// CourseController.js

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/course'); // Chemin relatif au contrôleur
        fs.mkdirSync(uploadPath, { recursive: true }); // Crée le dossier automatiquement
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const isValid = !!FILE_TYPE_MAP[file.mimetype];
        cb(isValid ? null : new Error('Type de fichier invalide'), isValid);
    }
}).single('imageOfCourse');

const CreateCourse = async (req, res) => {
  uploadOptions(req, res, async function (err) {
    // Gestion d'erreur améliorée
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        message: 'Erreur d\'upload', 
        error: err.message 
      });
    } else if (err) {
      return res.status(500).json({ 
        message: 'Erreur serveur', 
        error: err.message 
      });
    }

    try {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send('Catégorie invalide');

      // Modification ici (single file au lieu de array)
      if (!req.file) return res.status(400).send('Aucune image fournie');

      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      const imagePath = `${basePath}${req.file.filename}`; // Chemin unique

      const course = new Course({
        name_of_course: req.body.name_of_course,
        name_of_formator: req.body.name_of_formator,
        description: req.body.description,
        link: req.body.link,
        category: req.body.category,
        counter_of_ins: req.body.counter_of_ins,
        isDisplay: req.body.isDisplay,
        imageOfCourse: imagePath // Stocke le chemin unique
      });

      await course.save();
      res.status(201).json(course);

    } catch (error) {
      res.status(500).json({ 
        message: 'Erreur de création', 
        error: error.message 
      });
    }
  });
};
// Obtenir tous les produits
const getCourses = async (req, res) => {
    const CourseList = await Course.find().populate('category');

    if (!CourseList) {
        res.status(500).json({ success: false });
    }
    res.send(CourseList);
};

const getOneCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('category'); 
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving course', error });
    }
};

module.exports = {
    CreateCourse,
    getCourses,
    getOneCourse
};
