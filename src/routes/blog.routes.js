import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createBlog,
  getVerifiedBlogs,
  getBlogById,
  getMyBlogs,
  getPendingBlogs,
  verifyBlog,
  rejectBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();


router.get("/", getVerifiedBlogs);

router.get("/my/list", authMiddleware, getMyBlogs);


router.get("/admin/pending", authMiddleware, getPendingBlogs);
router.put("/admin/verify/:id", authMiddleware, verifyBlog);
router.put("/admin/reject/:id", authMiddleware, rejectBlog);


router.post("/", authMiddleware, createBlog);


router.get("/:id", getBlogById);

export default router;