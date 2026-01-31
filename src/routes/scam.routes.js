import express from "express";
import {
  reportScam,
  getLatestVerifiedScams,
  searchScams,
  getScamById,
} from "../controllers/scam.controller.js";
import { analyzeWithAI } from "../utils/aiScamAnalyzer.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/report", authMiddleware, reportScam);
router.get("/latest", getLatestVerifiedScams);
router.get("/search", searchScams);
router.get("/:id", getScamById);

// AI-powered scam analysis endpoint
router.post("/analyze-ai", async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== "string") {
      return res.status(400).json({ 
        success: false, 
        error: "Text is required for analysis" 
      });
    }

    if (text.length < 10) {
      return res.status(400).json({ 
        success: false, 
        error: "Text is too short for meaningful analysis" 
      });
    }

    const result = await analyzeWithAI(text);
    
    res.json(result);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Analysis failed: " + error.message 
    });
  }
});

export default router;
