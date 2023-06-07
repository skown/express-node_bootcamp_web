const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Router method to GET all the reviews and POST a new review
const router = express.Router({ mergeParams: true });
router.use(authController.protect);
/**
 * This router using mergeParams is used to get all the reviews and POST a new review and also POST on tourID router
 */
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//Router method to DELETE a review with specific tourID
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
