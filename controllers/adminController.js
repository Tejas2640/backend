import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Get all attendance records
export const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get all leave requests
export const getAllLeaves = async (req, res) => {
    try {
        const leaveRequests = await Leave.find();
        res.status(200).json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Admin login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, role: 'admin' });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password (assuming you have a method to compare passwords)
        const isMatch = await admin.comparePassword(password); // Implement this method in User model

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
