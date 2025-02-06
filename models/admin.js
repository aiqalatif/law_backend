const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
  dateOfBirth: {
    type: Date
  },
  isSuperAdmin: {
    type: Boolean,
    default: false  // Can be true for super admins
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing before saving Admin document
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

// Create Admin model based on the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
