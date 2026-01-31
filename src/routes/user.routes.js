import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyProfile, getLeaderboard } from "../controllers/user.controller.js";
import { updateProfilePic } from "../controllers/user.controller.js";
const router = express.Router();
router.put("/profile-pic", authMiddleware, updateProfilePic);

router.get("/me", authMiddleware, getMyProfile);


router.get("/leaderboard", getLeaderboard);


export default router;