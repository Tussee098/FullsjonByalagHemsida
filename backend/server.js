import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());  // Parse JSON bodies

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// API route example
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is data from the backend' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});