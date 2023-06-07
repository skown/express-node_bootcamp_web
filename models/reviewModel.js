// Review mongoose model that have review, rating, createdAt, reference to tour model and reference to user model as parent reference
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middleware before and after .find() that will populate the reviews with the tour name and user data
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }); - We are adding comments into this block becasue it's more logical not to populating tours inside the tourModel using virtuals populate method
  // Instead we just want to use user data inside tourModel
  // we are still using parent reference on the review (to avoid it we are using virtuals populate method)

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats_ratings = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  //console.log(stats_ratings);

  if (stats_ratings.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats_ratings[0].averageRating,
      ratingsQuantity: stats_ratings[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', function () {
  // NOTE: this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne() does NOT work here, query has already been executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//Mongoose model to create a review
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
