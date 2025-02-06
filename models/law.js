const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Criminal Law', 'Labor Law', 'Family Law', 'Other'], 
    required: true,
  },
  lawName: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  crime: {
    type: String,
    required: true, 
  },
  punishment: {
    type: String,
    required: true, 
  },
  keywords: {
    type: [String], 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Law = mongoose.model('Law', lawSchema);

module.exports = Law;
