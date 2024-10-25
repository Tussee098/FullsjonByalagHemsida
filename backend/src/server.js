import express from 'express';
import { mongoose } from 'mongoose';
import path from 'path';
import config from './configs/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import app from './app.js'; // Changed from { app } to app since it's a default export

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Remove this line since 'app' is already imported
// const app = app; // This was creating a circular reference

// Use absolute path with path.join
const browserDistFolder = path.join(__dirname, '../../frontend/dist/frontend/');

// Connect to MongoDB
const DBUrl = config.dbUrl;
const port = process.env.PORT || config.port; // Added process.env.PORT for Heroku

mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    
    // Remove this since it's already set up in app.js
    // app.use(express.json()); 

    // Serve static files from Angular app
    app.use(express.static(browserDistFolder));

    // Serve index.html for any other requests
    app.get('*', (req, res) => {
      // Fix the sendFile path
      res.sendFile(path.join(browserDistFolder, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => { // Added '0.0.0.0' for Heroku
      console.log(`Backend is running on port: ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));