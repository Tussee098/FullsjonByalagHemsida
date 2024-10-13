import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes.js'; // Import your routes
import authRoutes from './routes/authorization.js'
import categoriesRoutes from './routes/categoriesRoutes.js'

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/api', categoriesRoutes);

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
