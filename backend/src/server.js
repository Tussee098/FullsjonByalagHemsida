import app from './app.js'; // Import the app
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express'
import authRoutes from './routes/authorization.js'

// Load environment variables

dotenv.config();

// Connect to MongoDB
const DBUrl = process.env.DB_URL
const JWT_SECRET = process.env.JWT_SECRET
const port = process.env.PORT || 5000;


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
