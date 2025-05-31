const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name_of_course: { type: String, required: true },
    name_of_formator: { type: String, required: false },
    imageOfCourse: { type: String, required: false },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryCourse',
        required: true
    },
    description: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: String, required: true },
    counter_of_ins: { type: Number, default: 0 },
    isDisplay: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);