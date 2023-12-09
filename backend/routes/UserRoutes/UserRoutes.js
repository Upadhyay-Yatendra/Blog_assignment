import express from "express";
import userController from "../../controllers/userController.js";
import protectRoute  from "../../middlewares/protectRoute.js";
// Create an instance of the router
const router = express.Router();

const { signupUser, loginUser ,logoutUser,followUnfollowUser ,updateUser,getUserProfile,suggestedUsers} = userController;
// signup route
// login route
// update profile
// follow route

router.get("/profile/:query",getUserProfile);

router.post("/signup", signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);




export default router;
