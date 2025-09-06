const { Product } = require('../models/product');
const { Category } = require('../models/categoryProduit');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(uploadError, '/uploads/product'); 
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-'); 
        // const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage }).single('images')

const createProduct = async (req, res) => {
  try {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      boutique: req.body.boutique,   // obligatoire
      countInStock: req.body.countInStock,
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      isFeatured: req.body.isFeatured || false,
      images: req.file ? req.file.filename : ''
    });

    product = await product.save();

    res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès",
      product
    });

  } catch (error) {
    console.error("Erreur création produit :", error);
    res.status(500).json({ success: false, error: error.message });
  }
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
