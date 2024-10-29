import express from 'express';
import rateLimit from 'express-rate-limit'; // Import rate limiting
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes.js'; // Import your routes
import authRoutes from './routes/authorization.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Remove this line since 'app' is already imported
// const app = app; // This was creating a circular reference

// Use absolute path with path.join
const browserDistFolder = path.join(__dirname, '../../frontend/dist/frontend/browser');


app.set('trust proxy', 1); // 1 indicates a single proxy, such as Heroku
// Works
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

// Apply the rate limiter globally (on all routes)
app.use(limiter);

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // Max 5 login attempts per 15 minutes
  message: {
    message: "Too many login attempts, please try again after 15 minutes."
  }
});

// Apply loginLimiter to the login route
app.use('/auth/login', loginLimiter, authRoutes); // Apply to login specifically



// Middleware
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:4200',
      'https://fullsjon-website-59ddfac79ca1.herokuapp.com',
      process.env.HEROKU_APP_URL, // Add this as an environment variable in Heroku
      /\.herokuapp\.com$/ // This will allow any herokuapp.com subdomain
    ];

    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());



// Routes
app.use('/api/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/api', categoriesRoutes);


// Serve static files from Angular app
app.use(express.static(browserDistFolder, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
}
}));

// Serve index.html for any other requests
app.get('*', (req, res) => {
  // Fix the sendFile path
  
  res.sendFile(path.join(browserDistFolder, 'index.html'));
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
