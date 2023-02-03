const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('_overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('_tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('_login', {
    title: 'Log into your account',
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('_signup', {
    title: 'Create your account!',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('_account', {
    title: 'Your account',
  });
};
exports.getMyBookings = async (req, res, next) => {
  // booking: {user,tour}
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map(book => book.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('_overview', {
    title: 'My Bookings',
    tours,
  });
};
