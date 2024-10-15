import express from 'express';
import Post from '../models/Post.js'; // Assuming you have a Post model
import authorization from '../middleware/authorization.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res, next) => {
  const { category } = req.query;
  console.log(`Fetching posts with category: ${category}`);
  try {
    const posts = await Post.find({category:category});
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Get all posts
router.get('/:optionId', async (req, res, next) => {
  const { optionId } = req.query;
  console.log(`Fetching posts with category: ${optionId}`);
  try {
    const posts = await Post.find({optionId: optionId});
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Create a new post
router.post('/', authorization, async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
});

// Delete a post by ID
router.delete('/:id', authorization, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.status(200).json(deletedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});
// Add more routes as needed...

export default router; // Export the router
