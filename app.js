const express = require('express');
const app = express();
require('dotenv').config();  // Load .env file at the start
const firebaseAdmin = require('firebase-admin');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');  // Import the routes
const port = process.env.PORT || 4000;
const dbUri = process.env.DB_URI;
const lawRoutes = require('./routes/lawRoutes');
const cors = require('cors');
const path = require('path');

// Middleware to enable CORS
app.use(cors());
app.use(express.json());  // Middleware to parse JSON requests


app.use(express.static(path.join(__dirname, 'public')));
// Initialize Firebase Admin SDK
const serviceAccount = require('./config/lawapp-3ec1d-firebase-adminsdk-fbsvc-98e78ad32a.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

// Connect to MongoDB
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Use the authentication routes
app.use('/auth', authRoutes);  // Mount the auth routes under /auth endpoint
app.use('/laws', lawRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
