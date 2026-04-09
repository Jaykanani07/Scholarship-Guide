const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    }
});

const course = mongoose.model('course', yourSchema);

module.exports = course;
