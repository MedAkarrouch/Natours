const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
// const { createBookingCheckout } = require('../controllers/bookingController');

router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-bookings',
  authController.protect,
  viewsController.getMyBookings
);

router.get(
  '/',
  // createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);

module.exports = router;
