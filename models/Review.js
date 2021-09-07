const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add the review'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
// Calculate average rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        id: 'bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageReview(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageReview(this.bootcamp);
});
module.exports = mongoose.model('Review', ReviewSchema);
