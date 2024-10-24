// config.prod.js
const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
    dbUrl: process.env.DB_URL,
    // Add more variables as needed
  };
  
  export default config;
  