import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name of the category
  order: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the category was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

const NavBarCategory = mongoose.model('Category', categorySchema, 'categories');
export default NavBarCategory;

