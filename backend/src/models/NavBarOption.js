import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true}, // Name of the option
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the Category
  path: {type: String, require: true, unique: true},
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the option was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

const NavBarOption = mongoose.model('Option', optionSchema, 'options');
export default NavBarOption;
