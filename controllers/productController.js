const { Product } = require('../models/product');
const { Category } = require('../models/categoryProduit');

// ➕ Ajouter un produit
const createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ success: false, message: "Catégorie invalide" });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      boutique: req.body.boutique,
      countInStock: req.body.countInStock,
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      isFeatured: req.body.isFeatured || false,
      images: req.file ? req.file.path : null, 
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Erreur création produit :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📋 Obtenir tous les produits
const getProducts = async (req, res) => {
  try {
    const productList = await Product.find().populate('category');
    res.status(200).json(productList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔍 Obtenir un produit par ID
const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération produit', error });
  }
};

// ✏️ Mettre à jour un produit
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }

    // Si nouvelle image envoyée, remplacer
    if (req.file) {
      product.image = req.file.path;
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.boutique = req.body.boutique || product.boutique;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Produit mis à jour avec succès",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Erreur update produit :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🗑️ Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }
    res.status(200).json({ success: true, message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur suppression produit :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
