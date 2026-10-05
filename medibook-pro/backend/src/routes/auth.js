import { Router } from "express";
import { body } from "express-validator";
import { register, login, me, forgotPassword, resetPassword, verifyOTP } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const password = body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.");

router.post("/register", [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Enter a valid email."),
  password
], register);

router.post("/verify-otp", [
  body("email").isEmail().withMessage("Enter a valid email."),
  body("otp").notEmpty().withMessage("OTP is required.")
], verifyOTP);

router.post("/login", [
  body("email").isEmail().withMessage("Enter a valid email."),
  body("password").notEmpty().withMessage("Password is required."),
  body("role").isIn(["patient", "doctor", "admin"]).withMessage("Invalid account type.")
], login);

router.post("/forgot-password", body("email").isEmail().withMessage("Enter a valid email."), forgotPassword);

router.post("/reset-password/:token", password, resetPassword);

router.get("/me", protect, me);

export default router;
