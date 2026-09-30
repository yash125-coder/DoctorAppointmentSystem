import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export async function stats(req, res) {
  const [totalBookings, doctorsWithUser, patients, completed] = await Promise.all([
    Appointment.countDocuments(),
    Doctor.find().populate("user", "isActive"),
    User.countDocuments({ role: "patient" }),
    Appointment.find({ status: "completed" }).populate("doctor", "fees")
  ]);

  const activeDoctors = doctorsWithUser.filter((d) => d.user?.isActive).length;
  const revenue = completed.reduce((sum, a) => sum + Number(a.doctor?.fees || 0), 0);

  res.json({ totalBookings, activeDoctors, patients, revenue });
}

export async function users(req, res) {
  const list = await User.find({ role: { $ne: "admin" } })
    .select("name email role phone isActive createdAt")
    .sort({ createdAt: -1 });
  res.json(list);
}

export async function doctors(req, res) {
  const list = await Doctor.find().populate("user", "name email phone isActive").sort({ createdAt: -1 });
  res.json(list);
}

export async function createDoctor(req, res) {
  const { name, email, password, specialization, location, fees, experience, qualifications = [] } = req.body;

  if (!name || !email || !password || !specialization || !location) {
    return res.status(400).json({ message: "Name, email, password, specialization and location are required." });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists." });

  const user = await User.create({ name, email, password, role: "doctor" });
  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    location,
    fees: Number(fees || 0),
    experience: Number(experience || 0),
    qualifications
  });

  res.status(201).json(await doctor.populate("user", "name email phone"));
}

export async function updateDoctor(req, res) {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });

  const allowed = ["specialization", "location", "fees", "experience", "qualifications", "bio", "photo", "verified"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) doctor[key] = req.body[key];
  });
  await doctor.save();

  if (req.body.name || req.body.email) {
    const user = await User.findById(doctor.user);
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    await user.save();
  }

  res.json(await doctor.populate("user", "name email phone"));
}

export async function deleteDoctor(req, res) {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });

  await User.findByIdAndUpdate(doctor.user, { isActive: false });
  res.json({ message: "Doctor deactivated successfully." });
}

export async function appointments(req, res) {
  const list = await Appointment.find()
    .populate("patient", "name email phone")
    .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
    .sort({ date: -1, time: -1 });
  res.json(list);
}
