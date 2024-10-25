import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// config.js
let config = {
  port: process.env.PORT || 5000,
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
      config = {
        port: process.env.PORT || 5000,
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
console.log(config)
// Export the configuration
export default config;
