const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryProduit'
    },
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutique',   // 🔗 Référence à une boutique
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    images: {
        type: String,
        default: ''
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
