const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Helper: set httpOnly cookie + return user data
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // httpOnly cookie — JS on the client cannot read this, protecting against XSS
  res.cookie('jwt', token, {
    httpOnly: true,                               // not accessible via document.cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',                           // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000,            // 30 days in ms
  });

  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token, // still sending token in body for localStorage-based clients (backward compat)
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    sendTokenResponse(user, 200, res);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc    Logout user — clears httpOnly cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // expire immediately
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = { registerUser, loginUser, getMe, logoutUser };