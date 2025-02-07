const mongoose = require('mongoose');



const adminSchema = new mongoose.Schema({
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
    type: String,  // URL or path to the photo
    required: false
  },
  
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});



// Create Admin model based on the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
