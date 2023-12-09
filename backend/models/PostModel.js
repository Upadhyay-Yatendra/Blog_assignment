import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming you store the image URL as a string
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('BlogPost', blogPostSchema);

export default Post;
