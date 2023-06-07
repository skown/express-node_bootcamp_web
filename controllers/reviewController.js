const Review = require('./../models/reviewModel');
//const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('../controllers/handlerFactory');

// Function for retriving all reviews by find method from review model (database) with catchAsync error handling implemented
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   //If there is a tour ID in route get all reviews that belong to this tour ID specified in the route parameter
//   let filter = {};
//   if (req.params.tourId) {
//     filter = { tour: req.params.tourId };
//   }
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     success: 'Successfully retrieved all reviews',
//     results: reviews.length,
//     data: reviews,
//   });
// });

//Middleware fuction that allowing nested routes
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  //If there is no tour id in the request body, take ID from the route:
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  //If there is no user id in the request body, take ID from the logged in user:
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};

// Function for creating new reviews based on the request body and review model (database) with catchAsync error handling implemented
// exports.createReview = catchAsync(async (req, res, next) => {
//   //Allow nested routes
//   //If there is no tour id in the request body, take ID from the route:
//   if (!req.body.tour) {
//     req.body.tour = req.params.tourId;
//   }
//   //If there is no user id in the request body, take ID from the logged in user:
//   if (!req.body.user) {
//     req.body.user = req.user.id;
//   }

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     success: 'Successfully created a review',
//     data: newReview,
//   });
// });

//Delete review using factory function
exports.deleteReview = factory.deleteOne(Review);
//UPDATE review using factory function
exports.updateReview = factory.updateOne(Review);
//CREATE review using factory function
exports.createReview = factory.createOne(Review);
//GET review using factory function
exports.getReview = factory.getOne(Review);
//GET all reviews using factory function
exports.getAllReviews = factory.getAll(Review);
