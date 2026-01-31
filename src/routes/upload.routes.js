import express from "express";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();


router.post("/image", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const fileData = `data:${req.file.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(fileData, {
      folder: "scamshield",
      resource_type: "image",
    });

    return res.status(200).json({
      message: "✅ Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.log("❌ Upload error:", error);
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

export default router;