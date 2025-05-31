const mongoose = require('mongoose')

const course = new mongoose.Schema({
    name_of_course : {type : String ,require : true},
    name_of_formator : {type : String ,require : false},
    imageOfCourse : {type : String ,require : false},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryCourse',
        required: true
    },
    description : {type : String,require : true},
    link : {type : String,require : true},
    counter_of_ins : {type : Number,default: 0},
    isDisplay : {type : Boolean , default : false}
},{timestamps: true});


const Course = mongoose.model('Course', course); 
module.exports = Course; // Export unique
