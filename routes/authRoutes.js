

// routes/authRoutes.js
const router = require('express').Router();
const authController = require('../controllers/authController');  // Import the controller

// Register route
router.post("/register", authController.createUser);

// Login route
router.post("/login", authController.loginUser);

// Delete route
router.delete("/delete", authController.deleteUser);

module.exports = router;
