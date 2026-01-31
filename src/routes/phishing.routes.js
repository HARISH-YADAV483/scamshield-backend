import express from "express";
import {
  getQuestionsByLevel,
  submitAnswer,
  saveProgress,
} from "../controllers/phishing.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/questions/:level", authMiddleware, getQuestionsByLevel);
router.post("/submit", authMiddleware, submitAnswer);
router.post("/save-progress", authMiddleware, saveProgress);

export default router;