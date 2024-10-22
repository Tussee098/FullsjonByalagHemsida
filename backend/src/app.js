import express from 'express';
import rateLimit from 'express-rate-limit'; // Import rate limiting
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes.js'; // Import your routes
import authRoutes from './routes/authorization.js'
import categoriesRoutes from './routes/categoriesRoutes.js'

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

// Apply the rate limiter globally (on all routes)
app.use(limiter);

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Max 5 login attempts per 15 minutes
  message: {
    message: "Too many login attempts, please try again after 15 minutes."
  }
});

// Apply loginLimiter to the login route
app.use('/auth/login', loginLimiter, authRoutes); // Apply to login specifically

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
