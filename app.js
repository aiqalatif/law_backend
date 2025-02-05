const express = require('express');
const app = express();
require('dotenv').config();  // Load .env file at the start
const firebaseAdmin = require('firebase-admin')
const mongoose = require('mongoose');
const port = process.env.PORT || 4000; 
const dbUri = process.env.DB_URI;
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const serviceAccount = require('./config/lawapp-3ec1d-firebase-adminsdk-fbsvc-98e78ad32a.json');


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });

  // Adjust the path as needed
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});