const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  presentClass: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
