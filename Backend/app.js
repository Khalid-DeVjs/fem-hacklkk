import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from './middleware/error.js';

// Route files
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import taskRoutes from './routes/task.route.js';

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;