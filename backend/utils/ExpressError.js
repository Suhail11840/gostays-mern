class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass message to the base Error class constructor
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set the error name to the class name (e.g., "ExpressError")
    
    // Capture the stack trace, excluding the constructor call from it.
    // This is useful for debugging where the error originated.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      // Fallback for environments where captureStackTrace might not be available
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = ExpressError;