import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import infoRoutes from "./routes/infoRoutes.js"; // ✅ NEW

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Robust CORS setup
const LOCAL_ORIGIN = "http://localhost:5173";
const DEPLOYED_ORIGIN = process.env.CLIENT_URL; // Make sure this is set correctly on Render
const allowedOrigins = [LOCAL_ORIGIN, DEPLOYED_ORIGIN];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", attendanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/info", infoRoutes); // ✅ NEW

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Employee Attendance API is running...");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
