import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: false },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema, 'post');

export default Post; // Export the Post model
