const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT library


const admin = require('firebase-admin');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());




const User = require('../models/user');  

class AuthController {

    async createUser(req, res) {
        const { email, password, role,fcmToken } = req.body;
      
        try {
          console.log('Creating user with email:', email); 
       
          const newUser = new User({
            role,
            email,
            password,
            fcmToken, 
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

          console.log('Request Body:', req.body);
      
          const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

 
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
      
          // Find user in MongoDB
          
      
          
          res.status(200).json({
            message: 'Login successful',
          
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
