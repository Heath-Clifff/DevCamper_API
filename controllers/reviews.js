const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');

// @desc      Get all Reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get all Reviews
// @route     GET /api/v1/reviews/:id
// @access    Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc      Add reviews
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${req.params.id}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc      Update reviews
// @route     PUT /api/v1/reviews/:id
// @access    Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review found with id ${req.params.id}`));
  }

  // Make sure the review belongs to the user or admin
  if (review.user.toString() !== req.user.id && review.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete the review`, 401));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc      Delete reviews
// @route     PUT /api/v1/reviews/:id
// @access    Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review found with id ${req.params.id}`));
  }

  // Make sure the review belongs to the user or admin
  if (review.user.toString() !== req.user.id && review.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete the review`, 401));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
