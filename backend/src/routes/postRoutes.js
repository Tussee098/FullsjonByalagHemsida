import express from 'express';
import Post from '../models/Post.js'; // Assuming you have a Post model
import authorization from '../middleware/authorization.js';

const router = express.Router();


// Get all posts with a category passed as a query parameter
router.get('/', async (req, res, next) => {
  const { category } = req.query;  // Extract 'category' from the query parameters
  console.log(`Fetching posts with category: ${category}`);
  
  try {
    // Fetch posts based on the category (optionId)
    const posts = await Post.find({ optionId: category });
    res.json(posts);  // Send the filtered posts back as the response
  } catch (error) {
    next(error);  // Pass the error to the error-handling middleware
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
