import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controller/task.controller.js';

const router = express.Router();

// Base task routes
router.get('/get', getTasks);          // GET /api/tasks
router.post('/create', createTask);       // POST /api/tasks

// Task ID routes
router.get('/getSingle/:id', getTask);        // GET /api/tasks/:id
router.put('/update/:id', updateTask);     // PUT /api/tasks/:id
router.delete('delete/:id', deleteTask);  // DELETE /api/tasks/:id

// Task status update
router.put('single/:id/status', updateTaskStatus); // PUT /api/tasks/:id/status

export default router;