import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "HR", "Employee"], default: "Employee" },
  position: { type: String, required: true },
  department: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
});

export default mongoose.model("Employee", employeeSchema);
