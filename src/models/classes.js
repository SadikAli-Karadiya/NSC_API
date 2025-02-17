
const mongoose = require("mongoose");

const classes = new mongoose.Schema({
    class_name:{
        type: String,
        required: [true, 'Please enter class name'],
    },
    batch_start_year:{
        type: Number,
        required: [true, 'Please enter batch_start_year'],
        minLength: [4, 'Please enter four digits only'],
    },
    batch_duration:{
        type: Number,
        required:[true, 'Duration is required'],
    },
    total_student:{
        type: Number,
        default: 0
    },
    fees:{
        type: Number,
        required: [true, 'Please enter fees'],
    },
    is_primary:{
        type: Number,
        required: true,
    },
    stream:{
        default: "none",
        type: String,
        required: [true, 'Please select stream'],
    },
    medium:{
        type: String,
        required: [true, 'Please select medium'],
    },
    is_active:{
        default: 1,
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('classes', classes);