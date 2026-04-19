const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * protect middleware
 *
 * Supports two auth methods (in order of preference):
 *  1. httpOnly cookie named 'jwt'  — set by the server, not readable by JS
 *  2. Authorization: Bearer <token> header — for API clients / localStorage fallback
 *
 * This dual approach keeps the app working whether the frontend
 * uses cookies or localStorage-stored tokens.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Try httpOnly cookie first
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Fall back to Authorization header (Bearer token)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };