class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);// Call the parent class constructor with the error message
      this.statusCode = statusCode;// Add a status code property to the error
  
      // Capture the stack trace for better debugging
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {// whenever next is call this fun run
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Handle CastError (e.g., for invalid ObjectId in MongoDB)
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle duplicate key error (e.g., for unique fields in MongoDB)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid JWT error
    if (err.name === "JsonWebTokenError") {
      const message = `JSON Web Token is invalid. Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = `JSON Web Token has expired. Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Return the error response
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  export default ErrorHandler;
  