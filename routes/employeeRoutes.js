import express from "express";
import { registerEmployee, getEmployees, loginEmployee, logoutEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/register", registerEmployee);

router.post("/login", loginEmployee);

router.get("/", getEmployees); // Admin can get all employees
router.post("/logout", logoutEmployee); // Logout route



export default router;
