import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getMyTasks,
  getAllRawTasks,
} from '../controller/task.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all task routes
router.use(protect);
router.get('/mytasks', getMyTasks);
// Base task routes
router.get('/get', getTasks);
router.post('/create', createTask);

// Task ID routes
router.get('/getSingle/:id', getTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);
router.get('/getAll/', getAllRawTasks);

// Task status update
router.put('/single/:id/status', updateTaskStatus);

export default router;