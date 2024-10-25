// If not in production, load environment variables from .env file
import { dotenv } from 'dotenv';
dotenv.config();


// Export the configuration
const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DB_URL,
  // Add more variables as needed
};

