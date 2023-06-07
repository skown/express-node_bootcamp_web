//Operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //Parent call from Error class

    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith('4')
      ? 'Fail'
      : 'Error';

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
