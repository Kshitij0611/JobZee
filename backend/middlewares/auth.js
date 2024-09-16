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

/*
  Jitne bhi users ne login ya register kiya hai, un sab ke tokens alag-alag browsers ya devices me stored hote hain, 
  lekin req.cookies me sirf usi user ka token hoga jo abhi active session me hai, yani jo abhi request kar raha hai.

  Ek example ke liye, agar ek user login karta hai, toh server us user ke liye ek JWT token generate karta hai aur 
  us token ko browser ke cookies me store kar deta hai. Jab bhi user koi authenticated request bhejta hai, uska browser 
  us token ko req.cookies ke saath bhejta hai, taaki server us user ki identity verify kar sake.

  Isliye, req.cookies me multiple users ke tokens stored nahi hote, balki sirf us user ka token hota hai jo current 
  request kar raha hai.
*/

