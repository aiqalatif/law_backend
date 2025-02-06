const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  licenseExpiryDate: {
    type: Date,
    required: true,
  },
  specialties: {
    type: [String],  
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,  
    required: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,  // Initially false
  },
  isApproved: {
    type: Boolean,
    default: false,  // Initially false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

module.exports = Lawyer;
