const mongoose = require('mongoose');

const categoryproduitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

categoryproduitSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categoryproduitSchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('categoryproduit', categoryproduitSchema);
