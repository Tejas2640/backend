import Attendance from "../models/Attendance.js";

// ✅ Clock-In Function
export const clockIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!userId) return res.status(400).json({ message: "User ID is required." });
        if (userRole !== "employee") return res.status(403).json({ message: "Access denied! Employees only." });

        const today = new Date().toISOString().split("T")[0];

        const existingRecord = await Attendance.findOne({ userId, date: today });
        if (existingRecord && existingRecord.clockIn) {
            return res.status(400).json({ message: "Already clocked in today." });
        }

        const newAttendance = await Attendance.create({ userId, date: today, clockIn: new Date() });

        console.log("✅ Clock-In Success:", newAttendance);

        res.status(201).json({ message: "Clocked in successfully", data: newAttendance });
    } catch (error) {
        console.error("❌ Clock-in error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Clock-Out Function
export const clockOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!userId) return res.status(400).json({ message: "User ID is required." });
        if (userRole !== "employee") return res.status(403).json({ message: "Access denied! Employees only." });

        const today = new Date().toISOString().split("T")[0];

        const attendanceRecord = await Attendance.findOne({ userId, date: today });

        if (!attendanceRecord || attendanceRecord.clockOut) {
            return res.status(400).json({ message: "Already clocked out or no clock-in record found today." });
        }

        attendanceRecord.clockOut = new Date();
        await attendanceRecord.save();

        console.log("✅ Clock-Out Success:", attendanceRecord);

        res.status(200).json({ message: "Clocked out successfully", data: attendanceRecord });
    } catch (error) {
        console.error("❌ Clock-out error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get Attendance Records
export const getAttendance = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) return res.status(400).json({ message: "User ID is required." });

        let attendanceRecords;
        
        // Admins can fetch all records
        if (req.user.role === "admin") {
            attendanceRecords = await Attendance.find().sort({ date: -1 });
        } else {
            attendanceRecords = await Attendance.find({ userId }).sort({ date: -1 });
        }

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found." });
        }

        console.log("📜 Attendance Records:", attendanceRecords);

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("❌ Attendance fetch error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const getAllAttendance = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied! Admins only." });
        }

        const attendanceRecords = await Attendance.find()
            .populate('userId', 'name')
            .sort({ date: -1 });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found." });
        }

        console.log("📜 All Attendance Records:", attendanceRecords);
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("❌ Error fetching all attendance:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

