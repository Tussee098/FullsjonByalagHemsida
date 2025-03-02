import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  optionId: { type: String, required: true},
  author: { type: String, required: false },
  order: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema, 'post');

export default Post; // Export the Post model
