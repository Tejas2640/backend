import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Ensure the User model is imported
import jwt from "jsonwebtoken"; // Ensure jwt is imported

const router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save(); // Save the user to the database

        res.status(201).json({ message: "User registered successfully", user: { name, email, role } }); // Respond with success message

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});
router.post("/login", async (req, res) => {
    try {
        console.log("🔹 Login request received:", req.body);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("🔹 Generating token...");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Token generated successfully");

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});


export default router;
