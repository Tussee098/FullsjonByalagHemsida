import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Initial config setup
let config = {
  port: +(process.env.PORT || 5000), // Convert PORT to a number
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DB_URL,
  // Add more variables as needed
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

const loadConfig = async () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dotenv = await import('dotenv');
      dotenv.config({ path: envPath }); // Load environment variables from .env file

      // Update config after loading environment variables, ensuring port is a number
      config = {
        port: +(process.env.PORT || 5000), // Convert PORT to a number
        jwtSecret: process.env.JWT_SECRET,
        dbUrl: process.env.DB_URL,
        // Add more variables as needed
      };
    } catch (error) {
      console.error('Error loading dotenv:', error);
    }
  }
};

// Call the loadConfig function
await loadConfig();

// Export the configuration
export default config;
