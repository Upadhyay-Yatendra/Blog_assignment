import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helper/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
    //  fetching user profile either with username or userId
    // query is either username or userId
    const { query } = req.params;
  
    try {
      let user;
  
      // query is userId
      if (mongoose.Types.ObjectId.isValid(query)) {
        user = await User.findOne({ _id: query })
          .select("-password")
          .select("-updatedAt");
      } else {
        // query is username
        user = await User.findOne({ username: query })
          .select("-password")
          .select("-updatedAt");
      }
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in getUserProfile: ", err.message);
    }
  };
  
 // this is user signup function
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({
        message: "Invalid User Data",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.log("Error in Signup User :", error.message);
  }
};

// this is to allow user to login

const loginUser = async (req, res) => {
  try {
    
    console.log('\n\n\nLOGIN ROUTE INVOKED');
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // if user doesn't exist
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // if user exists then checking the password or comparing the password
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // if password is incorrect
    if (!checkCorrectPassword) {
      return res.status(401).json({ error: "Incorrect email or password!" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);

    // Logiing the request details
    console.log("Request Body:", req.body);
    console.log("Request Headers:", req.headers);

    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  now the logout controller
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in LogoutUser: ", err.message);
  }
};

export default {getUserProfile,signupUser,loginUser,logoutUser};