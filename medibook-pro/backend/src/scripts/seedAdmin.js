import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

await connectDB();

const email = process.env.ADMIN_EMAIL || "admin@medibook.local";
const password = process.env.ADMIN_PASSWORD || "Admin@12345";

const existing = await User.findOne({ email });
if (existing) {
  existing.role = "admin";
  existing.isActive = true;
  existing.password = password;
  await existing.save();
  console.log(`Admin updated: ${email}`);
} else {
  await User.create({
    name: "MediBook Administrator",
    email,
    password,
    role: "admin"
  });
  console.log(`Admin created: ${email}`);
}

process.exit(0);
