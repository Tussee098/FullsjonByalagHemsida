// config.js
let config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DB_URL,
  // Add more variables as needed
};

// Load dotenv only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  import('dotenv')
    .then((dotenv) => {
      dotenv.config(); // Load environment variables from .env file
    })
    .catch((error) => {
      console.error('Error loading dotenv:', error);
    });
}

// Export the configuration
export default config;
