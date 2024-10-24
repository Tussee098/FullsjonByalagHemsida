import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import config from './configs/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Connect to MongoDB
const DBUrl = config.dbUrl;
const port = config.port;

mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    
    app.use(express.json()); // Parse incoming requests

    // Serve static files from Angular app
    const frontendPath = path.join(__dirname, '../../frontend/dist/frontend/browser'); // Path to your Angular build
    app.use(express.static(frontendPath));

    // Serve index.html for any other requests
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    app.listen(port, () => {
      console.log(`Backend is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error: ' + DBUrl + '\n', err));
