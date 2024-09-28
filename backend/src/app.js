import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes.js'; // Import your routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postRoutes); // Mount routes under /api/posts

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message
  });
});

export default app; // Export the app instance
