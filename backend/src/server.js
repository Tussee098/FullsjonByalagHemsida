import app from './app.js'; // Import the app
import mongoose from 'mongoose';
import express from 'express'
import config from './config.js';

// Connect to MongoDB
const DBUrl = config.dbUrl
const JWT_SECRET = config.JWT_SECRET
const port = config.PORT


mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.use(express.json()); // Parse incoming requests

    app.listen(port, () => {
      console.log(`Backend is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
