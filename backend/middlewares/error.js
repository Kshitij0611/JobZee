class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) { // 11000 which is a specific code used by MongoDB to indicate a duplicate key error.
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`, 
    // Object.keys(err.keyValue) database mein jo duplicate entry error hua hai, 
    // uske fields ke naam nikalta hai. Isse error message clear ho jata hai ki kaunsa specific field (jaise email, username, etc.) duplicate hua hai.
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
