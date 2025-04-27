import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d', // Fallback to 30 days
  });
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };