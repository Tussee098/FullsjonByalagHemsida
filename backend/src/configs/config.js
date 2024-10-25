import dotenv from 'dotenv';

const loadConfig = () => {
  dotenv.config();
  
  return {
    port: process.env.PORT || 3000,
    dbUrl: process.env.MONGODB_URI || 'your_default_mongodb_url',
    // other config values...
  };
};

const config = loadConfig();
export default config;