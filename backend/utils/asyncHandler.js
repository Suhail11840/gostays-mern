const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // If the error is already an ExpressError, pass it along
    if (err instanceof require('./ExpressError')) { // Check instance of your custom error
        return next(err);
    }
    // For other errors, log them and create a generic 500 error
    console.error("Unexpected error in asyncHandler:", err);
    // Pass the original error for more detailed logging by the final error handler
    // or create a new ExpressError
    next(err); // The main error handler in server.js will format it
  });
};

module.exports = asyncHandler;