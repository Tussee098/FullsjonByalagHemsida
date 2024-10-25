import express from 'express';
import { mongoose } from 'mongoose';
import path from 'path';
import config from './configs/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { app } from 'app.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const browserDistFolder = '../../frontend/dist/frontend/browser'
const app = app;

// Connect to MongoDB
const DBUrl = config.dbUrl;
const port = config.port;

app.set('view engine', 'html');
app.set('views', browserDistFolder);


mongoose.connect(DBUrl)
  .then(() => {
    console.log('MongoDB connected');
    
    app.use(express.json()); // Parse incoming requests

    // Serve static files from Angular app
    const frontendPath = path.join(__dirname, browserDistFolder); // Path to your Angular build
    app.use(express.static(frontendPath));

    // Serve index.html for any other requests
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath));
    });

    app.listen(port, () => {
      console.log(`Backend is running on port: ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error: ' + DBUrl + '\n', err));
