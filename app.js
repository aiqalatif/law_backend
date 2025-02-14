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
const delay = require("delay");

const path = require('path');
const lawyerRoutes=require('./routes/lawyerRoutes');
const { OpenAI } = require('openai');
app.use(cors());
app.use(express.json());  


app.use(express.static(path.join(__dirname, 'public')));

const serviceAccount = require('./config/lawapp-3ec1d-firebase-adminsdk-fbsvc-98e78ad32a.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});
const prompt = 'tell me pllanties of thief in pakistan and correct my spell if any one is incorrect';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // API key should be in .env file
  });
  
  async function testOpenAI() {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello!" }],
      });
      console.log(response);
    } catch (error) {
      console.error("OpenAI Error:", error);
    }
  }
  
  testOpenAI();


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

