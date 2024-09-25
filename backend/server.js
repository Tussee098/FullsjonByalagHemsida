import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from'mongoose';

const app = express();
const port = process.env.PORT || 5000;
const DBUrl = 'mongodb://localhost:27017/about_us_posts';

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


// Connect to MongoDB
mongoose.connect(DBUrl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const postSchema = new mongoose.Schema({
    name: {type: String, required: true},
    author: {type: String, required: false}

}, { timestamps: true });

const Post = mongoose.model('Post', postSchema, 'post'); // Create the Post model

// Create a POST route to save the post
app.post('/api/posts', async (req, res) => {
  const newPost = new Post({
    name: req.body.name, // Directly access name
    author: req.body.author // Directly access author 
  });
  try {
    await newPost.save().then(savedPost => console.log("Post saved:", savedPost))
    .catch(err => console.error("Error saving post:", err));
    res.status(201).send(newPost);
  } catch (error) {
    console.error("Error saving the post:", error);
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});