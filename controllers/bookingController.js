const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
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
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-bookings?alert=booking`,
    // success_url: `${req.protocol}://${req.get('host')}/?user=${
    //   req.user.id
    // }&tour=${req.params.tourId}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    client_reference_id: req.params.tourId,
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

// exports.createBookingCheckout = async (req, res, next) => {
//   const { user, tour, price } = req.query;
//   if (!user || !tour || !price) return next();
//   await Booking.create({ user, tour, price });
//   res.redirect(`${req.protocol}://${req.get('host')}/`);
//   next();
// };
const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
};
exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
