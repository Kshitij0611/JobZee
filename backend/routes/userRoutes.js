import express from "express";
import { login, register, logout, getUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

/*

1) router.post("/register", register);

Yeh line /register URL endpoint define karti hai jo HTTP POST request ko handle karti hai.
Jab user /register pe POST request bhejta hai, toh register function execute hota hai jo userController.js mein defined hai.

2) router.post("/login", login);

Yeh line /login URL endpoint define karti hai jo HTTP POST request ko handle karti hai.
Jab user /login pe POST request bhejta hai, toh login function execute hota hai jo userController.js mein defined hai.

3) router.get("/logout", isAuthenticated, logout);

Yeh line /logout URL endpoint define karti hai jo HTTP GET request ko handle karti hai.
Pehle isAuthenticated middleware check karta hai ki user authenticated hai ya nahi.
Agar user authenticated hota hai, toh logout function execute hota hai jo userController.js mein defined hai.

4) router.get("/getuser", isAuthenticated, getUser);

Yeh line /getuser URL endpoint define karti hai jo HTTP GET request ko handle karti hai.
Pehle isAuthenticated middleware check karta hai ki user authenticated hai ya nahi.
Agar user authenticated hota hai, toh getUser function execute hota hai jo userController.js mein defined hai.

*/

export default router;
