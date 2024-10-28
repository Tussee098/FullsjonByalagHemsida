import express from 'express';
import { mongoose } from 'mongoose';
import config from './configs/config.js';
import app from './app.js'; // Changed from { app } to app since it's a default export



// Connect to MongoDB
const DBUrl = config.dbUrl;
const port = process.env.PORT || config.port; // Added process.env.PORT for Heroku

mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    
    // Remove this since it's already set up in app.js
    // app.use(express.json()); 

    

    app.listen(port, '0.0.0.0', () => { // Added '0.0.0.0' for Heroku
      console.log(`Backend is running on port: ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));