import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerEmployee = async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) return res.status(400).json({ message: "Employee already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({ name, email, password: hashedPassword, role, salary });

    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Include email in the JWT payload
    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, employee });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const logoutEmployee = async (req, res) => {
    try {
        // Here we can handle any necessary cleanup on the server side if needed
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
