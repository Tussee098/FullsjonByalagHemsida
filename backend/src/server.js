import app from './app.js'; // Import the app
import mongoose from 'mongoose';
import express from 'express';
import path from 'path'; // Import path module
import config from './config.js';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

// Get the current directory name
const __filename = fileURLToPath(import.meta.url); // Get the current file name
const __dirname = dirname(__filename); // Get the directory name

// Connect to MongoDB
const DBUrl = config.dbUrl;
const port = config.port; // Changed to match the config variable

mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');

    app.use(express.json()); // Parse incoming requests

    // Serve static files from Angular app
    const frontendPath = path.join(__dirname, '../../frontend/dist/frontend'); // Construct the path to your frontend files
    app.use(express.static(frontendPath));

    // Handle all GET requests to serve the Angular app
    /*app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html')); // Serve index.html for all routes
    });*/

    app.listen(port, () => {
      console.log(`Backend is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error: ' + DBUrl + '\n', err));
