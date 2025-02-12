const express = require('express');
const app = express();
require('dotenv').config(); 
const firebaseAdmin = require('firebase-admin');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');  
const port = process.env.PORT || 4000;
const dbUri = process.env.DB_URI;
const lawRoutes = require('./routes/lawRoutes');
const cors = require('cors');
const path = require('path');
const lawyerRoutes=require('./routes/lawyerRoutes');

app.use(cors());
app.use(express.json());  


app.use(express.static(path.join(__dirname, 'public')));

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


app.use('/auth', authRoutes);  
app.use('/laws', lawRoutes);
app.use('/lawyer', lawyerRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

