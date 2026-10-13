import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export async function listDoctors(req, res) {
  try {
    const { search, specialization, location, minRating } = req.query;
    const query = {};
    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (minRating) query.rating = { $gte: Number(minRating) };

    const doctors = await Doctor.find(query).populate("user", "name email avatar");
    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = doctors.filter(d => 
        (d.user && d.user.name && d.user.name.toLowerCase().includes(searchLower)) ||
        (d.specialization && d.specialization.toLowerCase().includes(searchLower))
      );
      return res.json(filtered);
    }
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDoctor(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "name email avatar");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function minutesToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, '0');
  const min = (m % 60).toString().padStart(2, '0');
  return `${h}:${min}`;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function getSlots(req, res) {
  try {
    const { date, id } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required." });
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const day = new Date(date).getDay();
    const schedule = doctor.schedule.find(s => s.day === day && s.enabled);
    if (!schedule) return res.json({ date, slots: [] });

    const start = timeToMinutes(schedule.start);
    const end = timeToMinutes(schedule.end);
    const booked = await Appointment.find({ doctor: id, date, status: { $in: ["pending", "confirmed"] } }).select("time");
    const bookedSet = new Set(booked.map(a => a.time));
    const slots = [];
    for (let t = start; t < end; t += 30) {
      const time = minutesToTime(t);
      slots.push({ time, available: !bookedSet.has(time) });
    }
    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateDoctorProfile(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const allowed = ["specialization", "location", "qualifications", "experience", "bio", "fees", "photo", "consultationAt"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) doctor[key] = req.body[key];
    }
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSchedule(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    if (!Array.isArray(req.body.schedule)) return res.status(400).json({ message: "Schedule must be an array." });

    doctor.schedule = req.body.schedule.map(s => ({
      day: Number(s.day),
      start: s.start,
      end: s.end,
      enabled: Boolean(s.enabled)
    }));
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function doctorAppointments(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone avatar")
      .sort({ date: 1, time: 1, createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// डॉक्टर आणि त्यांच्याशी संबंधित सर्व अपॉइंटमेंट्स डिलीट करण्यासाठी नवीन फंक्शन
export async function deleteDoctor(req, res) {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    await Appointment.deleteMany({ doctor: doctorId });
    await Doctor.findByIdAndDelete(doctorId);

    if (doctor.user) {
        await User.findByIdAndDelete(doctor.user);
    }

    res.status(200).json({ message: "Doctor and all associated appointments deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error while deleting doctor.", error: error.message });
  }
}


export async function listDoctors(req, res) {
  try {
    const { search, specialization, location, minRating } = req.query;
    const query = {};
    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (minRating) query.rating = { $gte: Number(minRating) };

    const doctors = await Doctor.find(query).populate("user", "name email avatar");
    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = doctors.filter(d => 
        (d.user && d.user.name && d.user.name.toLowerCase().includes(searchLower)) ||
        (d.specialization && d.specialization.toLowerCase().includes(searchLower))
      );
      return res.json(filtered);
    }
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDoctor(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "name email avatar");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function minutesToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, '0');
  const min = (m % 60).toString().padStart(2, '0');
  return `${h}:${min}`;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function getSlots(req, res) {
  try {
    const { date, id } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required." });
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const day = new Date(date).getDay();
    const schedule = doctor.schedule.find(s => s.day === day && s.enabled);
    if (!schedule) return res.json({ date, slots: [] });

    const start = timeToMinutes(schedule.start);
    const end = timeToMinutes(schedule.end);
    const booked = await Appointment.find({ doctor: id, date, status: { $in: ["pending", "confirmed"] } }).select("time");
    const bookedSet = new Set(booked.map(a => a.time));
    const slots = [];
    for (let t = start; t < end; t += 30) {
      const time = minutesToTime(t);
      slots.push({ time, available: !bookedSet.has(time) });
    }
    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateDoctorProfile(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const allowed = ["specialization", "location", "qualifications", "experience", "bio", "fees", "photo", "consultationAt"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) doctor[key] = req.body[key];
    }
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSchedule(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    if (!Array.isArray(req.body.schedule)) return res.status(400).json({ message: "Schedule must be an array." });

    doctor.schedule = req.body.schedule.map(s => ({
      day: Number(s.day),
      start: s.start,
      end: s.end,
      enabled: Boolean(s.enabled)
    }));
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function doctorAppointments(req, res) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone avatar")
      .sort({ date: 1, time: 1, createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// डॉक्टर आणि त्यांच्याशी संबंधित सर्व अपॉइंटमेंट्स डिलीट करण्यासाठी नवीन फंक्शन
export async function deleteDoctor(req, res) {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    await Appointment.deleteMany({ doctor: doctorId });
    await Doctor.findByIdAndDelete(doctorId);

    if (doctor.user) {
        await User.findByIdAndDelete(doctor.user);
    }

    res.status(200).json({ message: "Doctor and all associated appointments deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error while deleting doctor.", error: error.message });
  }
  }
                              
