// routes/auth.js
import express from 'express';  // Import express
import bcrypt from 'bcryptjs';  // Import bcrypt
import jwt from 'jsonwebtoken';  // Import jsonwebtoken
import User from '../models/User.js';  // Import User model (ensure the correct path and extension)
const router = express.Router();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Register User
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email, hashedPassword)
    // Save new user to the database
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
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
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

export default router;
