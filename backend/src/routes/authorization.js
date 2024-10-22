// routes/auth.js
import express from 'express';  // Import express
import bcrypt from 'bcryptjs';  // Import bcrypt
import jwt from 'jsonwebtoken';  // Import jsonwebtoken
import User from '../models/User.js';  // Import User model (ensure the correct path and extension)
import config from '../config.js';
import authorization from '../middleware/authorization.js';


const router = express.Router();
const JWT_SECRET = config.jwtSecret


// Register User
router.post('/register', authorization, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email, hashedPassword)
    // Save new user to the database
    const newUser = new User({ email, password: hashedPassword });
    console.log(newUser)
    await newUser.save();
    console.log("4")
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5h' });
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Token validation endpoint
router.post('/validate-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ isValid: false, error: 'Token is required' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // If token is valid, send a response
    return res.status(200).json({ isValid: true, decoded });
  } catch (err) {
    // If verification fails, return an invalid response
    return res.status(401).json({ isValid: false, error: 'Invalid token' });
  }
});

export default router;
