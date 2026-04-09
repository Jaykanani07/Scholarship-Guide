const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true
  },
  schemeDescription: {
    type: String,
    required: true
  },
  schemeCategory: {
    type: String,
    required: true
  },
  eligibilityCriteria: {
    type: [String],
    required: true
  },
  documentsRequired: {
    type: [String],
    required: true
  },
  benefits: {
    type: [String],
    required: true
  },
  stepsForApplying: {
    type: [String],
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;
