import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// register function ko define kar rahe hain jo new user ko register karega
export const register = catchAsyncErrors(async (req, res, next) => {
  // req.body se form ke fields ko extract kar rahe hain
  const { name, email, phone, password, role } = req.body;

  // Check kar rahe hain ki sabhi fields filled hain ya nahi
  if (!name || !email || !phone || !password || !role) {
    // Agar koi field missing hai, toh error return kar rahe hain
    return next(new ErrorHandler("Please fill full form!"));
  }

  // Check kar rahe hain ki email already registered hai ya nahi
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    // Agar email already registered hai, toh error return kar rahe hain
    return next(new ErrorHandler("Email already registered!"));
  }

  // Naya user create kar rahe hain database mein
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Token generate karke user ko send kar rahe hain
  sendToken(user, 201, res, "User Registered!");
});


export const login = catchAsyncErrors(async (req, res, next) => {
  // request ke body se email, password aur role extract karte hain
  const { email, password, role } = req.body;
  
  // agar email, password ya role missing ho to error return karte hain
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password and role."));
  }
  
  // database me email ke basis par user ko find karte hain aur password field ko include karte hain
  const user = await User.findOne({ email }).select("+password");
  
  // agar user nahi milta to error return karte hain
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  
  // password compare karte hain jo user ne provide kiya tha
  const isPasswordMatched = await user.comparePassword(password);
  
  // agar password match nahi hota to error return karte hain
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  
  // user ke role ko check karte hain
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  
  // agar sab kuch sahi hai to user ko token send karte hain aur response me success message dete hain
  sendToken(user, 201, res, "User Logged In!");
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  // response ka status 201 set karte hain aur cookie me token ko empty string karte hain
  res
    .status(201)
    .cookie("token", "", {
      // cookie ko sirf HTTP requests me accessible banate hain
      httpOnly: true,
      // cookie ka expiration time current time par set karte hain, taaki turant expire ho jaye
      expires: new Date(Date.now()),
    })
    // response me success message ke sath JSON return karte hain
    .json({
      success: true,
      message: "User Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});