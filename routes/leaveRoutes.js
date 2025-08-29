import express from "express";
import {
  requestLeave,
  getLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Submit leave request
router.post("/request", protect, requestLeave);

// ✅ Get leaves for logged-in user (employee) or all (admin)
router.get("/", protect, getLeaves);

// ✅ Update leave status (admin/HR)
router.put("/:leaveId", protect, updateLeaveStatus);

export default router;
