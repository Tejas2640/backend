export const registerEmployee = async (req, res) => {
    try {
      console.log("Incoming data:", req.body); // ✅ Add this line
  
      const { name, email, role, position, department, salary } = req.body;
  
      if (!name || !email || !role || !position || !department || !salary) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const existing = await Employee.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Employee already exists with this email." });
      }
  
      const employee = new Employee({
        name,
        email,
        role,
        position,
        department,
        salary,
      });
  
      await employee.save();
      res.status(201).json({ message: "Employee registered successfully", employee });
    } catch (error) {
      console.error("🔥 Error in registerEmployee:", error); // ✅ Add this line
      res.status(500).json({ message: error.message });
    }
  };
  