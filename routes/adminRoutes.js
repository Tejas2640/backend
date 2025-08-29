import express from 'express';
import { getAllAttendance, getAllLeaves, adminLogin } from '../controllers/adminController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to protect the routes
router.use(protect);

// Route to get all attendance records
router.get('/attendance', getAllAttendance);

// Route to get all leave requests
router.get('/leaves', getAllLeaves);

export default router;
