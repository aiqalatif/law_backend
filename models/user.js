const mongoose = require('mongoose');

// Define schema for User
const userSchema = new mongoose.Schema({
 name: {
    type: String,
    required: false
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false,  
    unique: true
  },
  profilePhoto: {
    type: String,  
    required: false  
  }, 
  fcmToken: {
    type: String, 
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
