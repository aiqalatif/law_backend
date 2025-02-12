const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  profilePhoto: { type: String, required: false },
  fcmToken: { type: String, required: false },
  role: { 
    type: String, 
    enum: ['admin', 'client', 'lawyer'], 
    required: true 
  },
  isVerified: { type: Boolean, default: false }, // Firebase email verification status
  lawyerProfile: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lawyer', // Reference to the Lawyer schema
    required: false 
  },
  createdAt: { type: Date, default: Date.now },        
});



const User = mongoose.model('User', userSchema);
module.exports = User;