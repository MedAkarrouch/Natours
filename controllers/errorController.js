const AppError = require('../utils/AppError');

const handleDuplicatedFieldsDB = err => {
  if (err.keyValue.email) {
    return new AppError(
      'This email is alredy taken, Please use another email',
      400
    );
  }
  return new AppError(
    `Duplicated field value " ${
      err.keyValue[Object.keys(err.keyValue)[0]]
    } Please use another value!`,
    400
  );
};
const handleValidationErrorDB = err => {
  // mine
  return new AppError(err.errors[Object.keys(err.errors)[0]].message, 400);
  // the right one
  // return new AppError(err.message, 400);
};

const handleCastErrorDB = err =>
  new AppError(`Invalid ${err.path} : ${err.value}`, 400);

const handleJWTError = () =>
  new AppError('Invalid token Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired! Please log in again.', 401);
// *************
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // WEBSITE
  return res.status(err.statusCode).render('_error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went very wrong!',
    });
  }
  // WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('_error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('_error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development')
    return sendErrorDev(err, req, res);
  if (process.env.NODE_ENV === 'production') {
    // console.log('Error\n', err.name);
    let error = Object.create(err);
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
