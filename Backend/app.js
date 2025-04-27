import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from './middleware/error.js';
import { connectDB } from './config/db.js';
const PORT = process.env.PORT || 5000;

// Route files
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import taskRoutes from './routes/task.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Server is running successfully on Vercel! 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
// Export for Vercel (DO NOT USE app.listen() here)
export default app;