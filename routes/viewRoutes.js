const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

//router.use(authController.isLoggedIn); We don't need it because it's similar to protect everywhere.

//Render the overview page
router.get(
  '/',
  authController.isLoggedIn,
  viewController.getOverview
);

//Render the tour page
router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getTour
);

//Render the login page
router.get(
  '/login',
  authController.isLoggedIn,
  viewController.getLogin
);

//ME
router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
