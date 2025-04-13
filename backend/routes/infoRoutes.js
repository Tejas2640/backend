// routes/infoRoutes.js
import express from 'express';
import {
  createInfo,
  getAllInfos,
  getMyInfo,
  updateInfo,
  deleteInfo,
  incrementSalary,
} from '../controllers/infoController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin creates info
router.post('/', protect, createInfo);

// Admin gets all infos
router.get('/', protect, getAllInfos);

// User gets their own info
router.get('/me', protect, getMyInfo);

// Admin updates info
router.put('/:id', protect, updateInfo);

// Admin deletes info
router.delete('/:id', protect, deleteInfo);

// Admin increments salary
router.put('/:id/increment', protect, incrementSalary);

export default router;
