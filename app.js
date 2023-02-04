const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoute = require('./routers/userRoutes');
const tourRoute = require('./routers/tourRoutes');
const reviewRoute = require('./routers/reviewRoutes');
const bookingRoute = require('./routers/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const path = require('path');
const viewRoute = require('./routers/viewRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const pug = require('pug');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);
// Implement Cors
app.use(cors());
app.options('*', cors());
// Set security HTTP headers
// app.use(helmet());
// *******************
// ******************************************************
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

app.use(compression());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSql query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupeSize',
      'difficulty',
    ],
  })
);
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/', viewRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
// *********************************************
// *********************************************
app.use(globalErrorHandler);

module.exports = app;
