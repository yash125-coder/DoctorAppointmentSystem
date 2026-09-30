import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export async function listDoctors(req, res) {
  const { search = "", specialization = "", location = "", minRating = "" } = req.query;
  const query = {};
  if (specialization) query.specialization = new RegExp(specialization, "i");
  if (location) query.location = new RegExp(location, "i");
  if (minRating) query.rating = { $gte: Number(minRating) };

  let doctors = await Doctor.find(query).populate("user", "name email avatar");
  if (search) {
    const s = search.toLowerCase();
    doctors = doctors.filter((d) =>
      `${d.user?.name || ""} ${d.specialization} ${d.location}`.toLowerCase().includes(s)
    );
  }

  res.json(doctors);
}

export async function getDoctor(req, res) {
  const doctor = await Doctor.findById(req.params.id).populate("user", "name email avatar phone");
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
}

function minutesToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const min = (m % 60).toString().padStart(2, "0");
  return `${h}:${min}`;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function getSlots(req, res) {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required." });

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const day = new Date(`${date}T00:00:00`).getDay();
  const schedule = doctor.schedule.find((s) => s.day === day && s.enabled);

  if (!schedule) return res.json({ date, slots: [] });

  const start = timeToMinutes(schedule.start);
  const end = timeToMinutes(schedule.end);
  const booked = await Appointment.find({
    doctor: doctor._id,
    date,
    status: { $in: ["pending", "confirmed"] }
  }).select("time");

  const bookedSet = new Set(booked.map((a) => a.time));
  const slots = [];
  for (let t = start; t + 30 <= end; t += 30) {
    const time = minutesToTime(t);
    slots.push({ time, available: !bookedSet.has(time) });
  }

  res.json({ date, slots });
}

export async function updateDoctorProfile(req, res) {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

  const allowed = ["specialization", "location", "qualifications", "experience", "bio", "fees", "photo", "consultationMode"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) doctor[key] = req.body[key];
  }
  await doctor.save();
  res.json(doctor);
}

export async function updateSchedule(req, res) {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
  if (!Array.isArray(req.body.schedule)) {
    return res.status(400).json({ message: "Schedule must be an array." });
  }

  doctor.schedule = req.body.schedule.map((s) => ({
    day: Number(s.day),
    start: s.start,
    end: s.end,
    enabled: Boolean(s.enabled)
  }));
  await doctor.save();
  res.json(doctor);
}

export async function doctorAppointments(req, res) {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate("patient", "name email phone avatar")
    .sort({ date: 1, time: 1, createdAt: -1 });

  res.json(appointments);
}
