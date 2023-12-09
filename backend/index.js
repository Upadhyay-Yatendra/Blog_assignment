import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from './routes/UserRoutes/UserRoutes.js'
import cookieParser from "cookie-parser";
import postRoutes from './routes/PostRoutes/PostRoutes.js'


dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
// Use cors middleware
app.use(cors({ 
  origin: 'http://localhost:3006', // Replace with the actual origin of your frontend
  credentials: true,
}));

// routes
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/posts",postRoutes)
app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);