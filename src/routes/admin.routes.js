import express from "express";
import {
  getPendingReports,
  verifyReport,
  rejectReport,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/pending", getPendingReports);
router.put("/verify/:id", verifyReport);
router.put("/reject/:id", rejectReport);

export default router;