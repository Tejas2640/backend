import express from "express";
import { clockIn, clockOut, getAttendance, getAllAttendance } from "../controllers/attendanceController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee Routes
router.post("/attendance/clock-in", protect, clockIn);
router.post("/attendance/clock-out", protect, clockOut);
router.get("/attendance/:userId", protect, getAttendance);

// ✅ Add this route for admins to fetch all attendance records
router.get("/attendance", protect, getAllAttendance);

export default router;
