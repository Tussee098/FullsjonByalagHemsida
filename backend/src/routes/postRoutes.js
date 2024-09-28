import express from 'express';
import Post from '../models/Post.js'; // Assuming you have a Post model

const router = express.Router();

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Create a new post
router.post('/', async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
});

// Add more routes as needed...

export default router; // Export the router
