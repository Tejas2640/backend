import Leave from "../models/Leave.js";

// ✅ Submit leave request (unchanged)
export const requestLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    const validTypes = ["sick", "vacation", "personal", "other"];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid leave type. Valid types are: sick, vacation, personal, other"
      });
    }

    const newLeave = new Leave({
      userId: req.user.id,
      type,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    res.status(201).json({ message: "Leave request submitted successfully." });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get leave requests
export const getLeaves = async (req, res) => {
  try {
    let leaves;

    if (req.user.role === "admin" || req.user.role === "hr") {
      // Admin or HR sees all
      leaves = await Leave.find()
        .populate({ path: "userId", select: "name email", model: "User" }) // 🔄 FIX: model = "User"
        .sort({ createdAt: -1 });
    } else {
      // Employee sees only their own
      leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found." });
    }

    res.status(200).json({ message: "Leave status updated.", updatedLeave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
