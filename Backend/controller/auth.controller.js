import { generateToken } from '../config/jwt.js';
import User from '../models/User.js'; // Capitalize to distinguish Model from instance
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
  
    try {
      // Create user (use `User` model, not `user`)
      const newUser = await User.create({ // ✅ Fixed
        name,
        email,
        password,
      });
  
      sendTokenResponse(newUser, 200, res);
    } catch (err) {
      next(err);
    }
  };

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
  
    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password');
  
      if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }
  
      // Check if password matches
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }
  
      // Successful login response
      sendTokenResponse(user, 200, res, 'Login successful');
    } catch (err) {
      next(err);
    }
  };
  
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
  
    // Set default expiry (e.g., 30 days) if JWT_COOKIE_EXPIRE is missing
    const expiresInDays = process.env.JWT_COOKIE_EXPIRE || 30;
    const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;
  
    const options = {
      expires: new Date(Date.now() + expiresInMs), // ✅ Correct Date object
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
      login : "Successfull"
    });
  };

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};