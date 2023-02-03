const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
  setUserTourIds,
} = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });
// {{URL}}api/v1/tours/5c88fa8cf4afda39709c2955/reviews
// router.route('/:id')
//
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setUserTourIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
