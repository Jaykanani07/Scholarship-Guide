const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
    caste: {
        type: String,
        required: true
    }
});

const caste = mongoose.model('caste', yourSchema);

module.exports = caste;
