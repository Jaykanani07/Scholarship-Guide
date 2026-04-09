const mongoose = require('mongoose');
const presentclasses = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const presentclass = mongoose.model('presentclass', presentclasses);

module.exports = presentclass;
