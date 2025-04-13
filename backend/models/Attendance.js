import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    clockIn: { type: Date },
    clockOut: { type: Date },
});

export default mongoose.model("Attendance", AttendanceSchema);
