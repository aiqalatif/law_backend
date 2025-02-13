const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true,
     unique: true, lowercase: true },

  phone: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  licenseIssuingAuthority: {
    type: String,
    required: true,
  },
  licenseExpiryDate: {
    type: Date,
    required: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  specialties: {
    type: [String],  
    required: false,
  },
  officeAddress: {
    type: String,
    required: true,
  },
 

  workingHours: {
    type: String, 
    required: false, 
  },
  languagesSpoken: {
    type: [String], 
    required: true,
  },
  profilePicture: {
    type: String,  
    required: false,
  },
  barCouncilIDCard: {
    type: String,  
    required: true, 
  },
  cnic: {
    type: String,  
    required: false, 
  },
  isAvailableForOnlineConsultation: {
    type: Boolean,
    default: false, 
  },
  licenseIssuingDate: {  // ✅ Added this field
    type: Date,
    required: true,
  },
  consultationFee: {
    type: Number, 
    required: false, 
  },
  paymentDetails: {
    type: String,
    required: false, 
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "formIncomplete"],
    default: "pending", 
  },
  
  caseSuccessRate: {
    type: Number,
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

module.exports = Lawyer;
