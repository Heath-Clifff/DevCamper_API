const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check for headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  // Check if the token matches
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (err) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};
