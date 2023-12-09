import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import protectRoute from "../middlewares/protectRoute.js";
import { v2 as cloudinary } from "cloudinary";

const getPost = async (req, res) => {
  try {
    console.log("Get Posts invoked");
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    
    let { image } = req.body;

    const { title, body } = req.body;

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      image = uploadedResponse.secure_url;
    }
    else{
        image = " ";
    }
    const newPost = new Post({ title, body, image });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHomePosts = async (req, res) => {
  try {
    // Fetch 10 posts sorted by the recent date created
    const posts = await Post.find().sort({ createdAt: -1 }).limit(10);

    // Your logic to handle the fetched posts
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { getPost, createPost, deletePost ,getHomePosts};
