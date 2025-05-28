class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass message to the base Error class constructor
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set the error name to the class name
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}
module.exports = ExpressError;