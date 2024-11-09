const { Course } = require('../models/course');
const { Category } = require('../models/category_course');
const multer = require('multer');

// Gestionnaire de types de fichiers valides
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = multer({ storage }).array('images', 10);

const CreateCourse = async (req, res) => {
    uploadOptions(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: 'Image upload failed', error: err.message });
        }

        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const files = req.files; // Accessing the uploaded files
        if (!files || files.length === 0) return res.status(400).send('No images in the request');

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const imagePaths = files.map(file => `${basePath}${file.filename}`); // Create paths for all uploaded images

        let course = new Course({
            name_of_course: req.body.name_of_course,
            name_of_formator: req.body.name_of_formator,
            description: req.body.description,
            link: req.body.link,
            category: req.body.category,
            counter_of_ins: req.body.counter_of_ins,
            isDisplay: req.body.isDisplay,
            imageOfCourse: imagePaths 
        });

        course = await course.save();

        if (!course) return res.status(500).send('The product cannot be created');

        res.send(course);
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
