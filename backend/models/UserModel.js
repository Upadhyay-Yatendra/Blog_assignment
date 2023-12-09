// Import necessary modules
import mongoose from "mongoose";

const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length (adjust as needed)
  },
});

const User = model("User", userSchema);

// Export the User model
export default User;
