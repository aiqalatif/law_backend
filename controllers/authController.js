const express = require('express');


const admin = require('firebase-admin');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());




const User = require('../models/user');  

class AuthController {

    async createUser(req, res) {
        const { email, password, fcmToken,name,phoneNumber } = req.body;
      
        try {
          console.log('Creating user with email:', email); 
       
          const newUser = new User({
            name,
            email,
            password,
            phoneNumber, 
            fcmToken,
            isVerified: false,
          });
      
          await newUser.save();
          console.log('User created successfully'); // Log success
      
          res.status(201).json({
            message: 'User created successfully. Please verify your email.',
          });
        } catch (error) {
          console.error('Error registering user:', error); // Log error
          res.status(500).json({ message: 'Error registering user', error: error.message });
        }
      }
      

      
    

      async  loginUser(req, res) {
        const { email, password, fcmToken } = req.body;
      
        try {
          console.log('Request Body:', req.body);
      
          // Check if all fields are provided
          if (!email || !password || !fcmToken) {
            return res.status(402).json({ message: 'All fields are required' });
          }
      
          // Find user in MongoDB
          const user = await User.findOne({ email });
      
          if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
      
          // Compare the provided password with the hashed password in the database
          
      
         
      
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
