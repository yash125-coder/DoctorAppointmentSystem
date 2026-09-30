import crypto from "crypto";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { signToken } from "../utils/token.js";
import { sendEmail } from "../utils/mailer.js";

function validationError(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errors.array()[0].msg;
  return null;
}

export async function register(req, res) {
  const error = validationError(req);
  if (error) return res.status(400).json({ message: error });

  const { name, email, password, phone, role, specialization, location } = req.body;
  const allowedRole = role === "doctor" ? "doctor" : "patient";

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "An account with this email already exists." });

  const user = await User.create({ name, email, password, phone, role: allowedRole });

  if (allowedRole === "doctor") {
    if (!specialization || !location) {
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ message: "Specialization and location are required for doctors." });
    }
    await Doctor.create({
      user: user._id,
      specialization,
      location,
      qualifications: [],
      schedule: [
        { day: 1, start: "09:00", end: "17:00", enabled: true },
        { day: 2, start: "09:00", end: "17:00", enabled: true },
        { day: 3, start: "09:00", end: "17:00", enabled: true },
        { day: 4, start: "09:00", end: "17:00", enabled: true },
        { day: 5, start: "09:00", end: "17:00", enabled: true }
      ]
    });
  }

  const token = signToken({ id: user._id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

export async function login(req, res) {
  const error = validationError(req);
  if (error) return res.status(400).json({ message: error });

  const { email, password, role } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive || user.role !== role) {
    return res.status(401).json({ message: "Invalid email, password, or account type." });
  }

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid email, password, or account type." });

  const token = signToken({ id: user._id, role: user.role });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

export async function me(req, res) {
  let doctor = null;
  if (req.user.role === "doctor") {
    doctor = await Doctor.findOne({ user: req.user._id });
  }
  res.json({ user: req.user, doctor });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Same response whether or not an account exists.
  if (!user) {
    return res.json({ message: "If an account exists, reset instructions have been sent." });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your MediBook password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px">
        <h2 style="color:#0f766e">Reset your password</h2>
        <p>Hi ${user.name},</p>
        <p>This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#0f766e;color:white;border-radius:10px;text-decoration:none">Reset password</a>
      </div>
    `
  });

  res.json({ message: "If an account exists, reset instructions have been sent." });
}

export async function resetPassword(req, res) {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  }).select("+password");

  if (!user) return res.status(400).json({ message: "Reset link is invalid or expired." });

  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password updated successfully. You can now log in." });
}
