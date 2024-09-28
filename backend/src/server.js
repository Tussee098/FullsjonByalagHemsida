import app from './app.js'; // Import the app
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables

dotenv.config();

// Connect to MongoDB
const DBUrl = process.env.DB_URL

const port = process.env.PORT || 5000;


mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Backend is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
