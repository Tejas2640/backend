// controllers/infoController.js
import Info from '../models/infoModel.js';  // Assuming you have the Info model

// Create new info (Admin only)
export const createInfo = async (req, res) => {
  try {
    const { user, name, email, position, role, department, salary, joiningDate } = req.body;
    const newInfo = new Info({ user, name, email, position, role, department, salary, joiningDate });
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating info', error: error.message });
  }
};

// Get all infos (Admin only)
export const getAllInfos = async (req, res) => {
  try {
    const infos = await Info.find();
    res.status(200).json(infos);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching infos', error: error.message });
  }
};

// Get own info (User only)
export const getMyInfo = async (req, res) => {
  try {
    const userInfo = await Info.findOne({ user: req.user.id });  // Assuming req.user.id is the logged-in user's ID
    if (!userInfo) {
      return res.status(404).json({ message: 'Info not found' });
    }
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching info', error: error.message });
  }
};

// Update info (Admin only)
export const updateInfo = async (req, res) => {
  try {
    const updatedInfo = await Info.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInfo) {
      return res.status(404).json({ message: 'Info not found' });
    }
    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating info', error: error.message });
  }
};

// Delete info (Admin only)
export const deleteInfo = async (req, res) => {
  try {
    const deletedInfo = await Info.findByIdAndDelete(req.params.id);
    if (!deletedInfo) {
      return res.status(404).json({ message: 'Info not found' });
    }
    res.status(200).json({ message: 'Info deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting info', error: error.message });
  }
};

// Increment salary (Admin only)
export const incrementSalary = async (req, res) => {
  try {
    const { percentage } = req.body;
    const info = await Info.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ message: 'Info not found' });
    }

    const incrementAmount = (info.salary * percentage) / 100;
    info.salary += incrementAmount;

    await info.save();
    res.status(200).json(info);
  } catch (error) {
    res.status(400).json({ message: 'Error incrementing salary', error: error.message });
  }
};
