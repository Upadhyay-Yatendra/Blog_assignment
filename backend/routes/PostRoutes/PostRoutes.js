import express from "express";
import postController from "../../controllers/postController.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

const { createPost, deletePost, getPost, getHomePosts } = postController;

router.post("/create", protectRoute, createPost);
router.get("/home", getHomePosts); // This is to get posts for homepage
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
