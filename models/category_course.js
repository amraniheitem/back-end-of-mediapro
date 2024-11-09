const mongoose = require('mongoose');

const categoryCourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

categoryCourseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Fix: Use the correct schema name here (categoryCourseSchema)
categoryCourseSchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('CategoryCourse', categoryCourseSchema);
