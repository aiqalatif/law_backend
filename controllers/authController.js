const express = require('express');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const admin = require('firebase-admin');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());




const User = require('../models/user');  

class AuthController {

    async createUser(req, res) {
        const { email, password, role,fcmToken,approvalStatus } = req.body;
      
        try {
          console.log('Creating user with email:', email); 
       
          const newUser = new User({
            role,
            email,
            password,
            fcmToken,
            approvalStatus, 
            isVerified: false,
          });
      
          await newUser.save();
          console.log('User created successfully'); 
      
          res.status(201).json({
            message: 'User created successfully. Please verify your email.',
          });
        } catch (error) {
          console.error('Error registering user:', error); // Log error
          res.status(500).json({ message: 'Error registering user', error: error.message });
        }
      }
      

      
    
      
      async loginUser(req, res) {
        try {
            console.log('Request Body:', req.body);
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({ error: 'ID token is required' });
            }

            // ✅ Firebase Token Verify karo
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email } = decodedToken;

            // ✅ Find user in MongoDB
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('JWT_SECRET:', process.env.JWT_SECRET); // ✅ Debugging
            // ✅ Generate JWT Token
            const token = jwt.sign(
                { id: user._id, role: user.role }, // Payload
                process.env.JWT_SECRET, // Secret key
                { expiresIn: process.env.JWT_EXPIRES_IN } // Expiry
            );

            res.status(200).json({
                message: 'Login successful',
                token,  // Send JWT token to frontend
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    }
  // Delete a user
  async deleteUser(req, res) {
    const { email } = req.body;

    try {
      // Find and delete user from MongoDB
      const deletedUser = await User.findOneAndDelete({ email });

      if (!deletedUser) {
        return res.status(400).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
}

module.exports = new AuthController();  // Export an instance of the class
