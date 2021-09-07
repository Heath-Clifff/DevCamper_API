const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 400));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc      Add user
// @route     POST /api/v1/users
// @access    Private
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`User not found`, 400));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc      Delete user
// @route     PUT /api/v1/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found`, 400));
  }

  res.status(200).json({ success: true, data: {} });
});
