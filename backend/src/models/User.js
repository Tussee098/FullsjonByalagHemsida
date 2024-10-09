import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('LoginUser', loginSchema, 'adminAccounts');

export default User;