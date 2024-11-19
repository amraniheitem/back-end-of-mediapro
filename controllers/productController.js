const { Product } = require('../models/product');
const { Category } = require('../models/category');
const multer = require('multer');
// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const isValid = FILE_TYPE_MAP[file.mimetype];
        // let uploadError = new Error('Invalid image type');

        // if (isValid) {
        //     uploadError = null;
        // }
        cb(uploadError, '/uploads'); // Ensure the path is correct and folder exists
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-'); // Replace spaces in filename
        // const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

// Set multer options (limit to 10 files)
const uploadOptions = multer({ storage: storage }).single('images')

// Create a new product with image upload
const createProduct = async (req, res) => {
    // uploadOptions(req, res, async function (err) {
        // if (err) {
        //     return res.status(400).send({ message: 'Image upload failed', error: err.message });
        // }
        // const category = await Category.findById(req.body.category);
        // if (!category) return res.status(400).send('Invalid Category');

        // const files = req.files;
        // if (!files || files.length === 0) return res.status(400).send('No image in the request');
        // const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
        try {
            console.log("print --> 1");
            let product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                images: req.file.filename
            });
    
            product = await product.save();
    
            if (!product) return res.status(500).send('The product cannot be created');
    
            res.send(product);
        } catch (error) {
            console.log("error",error)
        }
    // });
};

// Obtenir tous les produits
const getProducts = async (req, res) => {
    const productList = await Product.find().populate('category');

    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
};

// Obtenir un produit par ID
const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category'); // Populer la catégorie
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getOneProduct
};
