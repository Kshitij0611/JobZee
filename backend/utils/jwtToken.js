// sendToken function ko define kar rahe hain jo user ko token send karega
export const sendToken = (user, statusCode, res, message) => {
  // User se JWT token generate kar rahe hain
  const token = user.getJWTToken();

  // Cookie options define kar rahe hain, including expiry time
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Cookie expiry time set kar rahe hain (days to milliseconds)
    ),
    httpOnly: true, // HTTP only flag set kar rahe hain taaki cookie ko client-side JavaScript se access na kiya ja sake
  };

  // Response mein status code, cookie aur JSON data send kar rahe hain
  res.status(statusCode)
    .cookie("token", token, options) // Cookie set kar rahe hain jisme "token" naam aur token value hai
    .json({
      success: true, // Response mein success flag set kar rahe hain
      user, // User data include kar rahe hain
      message, // Custom message include kar rahe hain
      token, // Token bhi include kar rahe hain
    });
};
