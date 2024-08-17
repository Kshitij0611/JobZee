import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// isAuthenticated middleware ko define kar rahe hain jo user authentication check karega
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // req.cookies se token extract kar rahe hain
  const { token } = req.cookies;

  // Agar token nahi mila toh unauthorized error throw kar rahe hain
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  // JWT token ko verify karke user data nikal rahe hain
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Database se user ko find kar rahe hain using decoded token se mila hua user id
  req.user = await User.findById(decoded.id);

  // next() ko call karke request ko aage process kar rahe hain
  next();
});

