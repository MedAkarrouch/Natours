const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('A tour with that id does not exist', 400));
  }
  // Create Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?user=${
      req.user.id
    }&tour=${req.params.tourId}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    client_reference_id: req.user.id,
    customer_email: req.user.email,
    // product info
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });
  // Send session
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = async (req, res, next) => {
  const { user, tour, price } = req.query;
  if (!user || !tour || !price) return next();
  await Booking.create({ user, tour, price });
  res.redirect(`${req.protocol}://${req.get('host')}/`);
  next();
};

exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
