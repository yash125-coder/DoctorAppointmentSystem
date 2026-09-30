import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { sendEmail, appointmentEmail } from "../utils/mailer.js";

export async function createAppointment(req, res) {
  const { doctorId, date, time, reason = "" } = req.body;
  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: "Doctor, date and time are required." });
  }

  const doctor = await Doctor.findById(doctorId).populate("user", "name email");
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });

  if (date < new Date().toISOString().slice(0, 10)) {
    return res.status(400).json({ message: "Appointments cannot be booked in the past." });
  }

  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      status: "pending"
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "specialization location fees photo user")
      .populate("patient", "name email phone");

    res.status(201).json(populated);

    // Fire-and-forget email; appointment is already safely persisted.
    if (req.user.email) {
      sendEmail({
        to: req.user.email,
        ...appointmentEmail({
          patientName: req.user.name,
          doctorName: doctor.user.name,
          date,
          time,
          status: "confirmed"
        })
      }).catch(console.error);
    }
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "That time slot was just booked. Please choose another slot." });
    }
    throw err;
  }
}

export async function myAppointments(req, res) {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate({ path: "doctor", populate: { path: "user", select: "name avatar email" } })
    .sort({ date: -1, time: -1 });
  res.json(appointments);
}

export async function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ["confirmed", "rejected", "cancelled", "completed"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid appointment status." });

  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email")
    .populate({ path: "doctor", populate: { path: "user", select: "name email" } });

  if (!appointment) return res.status(404).json({ message: "Appointment not found." });

  const isPatient = String(appointment.patient._id) === String(req.user._id);
  const isDoctor = appointment.doctor && String(appointment.doctor.user._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin";

  if (!isPatient && !isDoctor && !isAdmin) return res.status(403).json({ message: "Not allowed." });

  if (isPatient && !["cancelled"].includes(status)) {
    return res.status(403).json({ message: "Patients can only cancel appointments." });
  }

  if (isDoctor && !["confirmed", "rejected", "completed", "cancelled"].includes(status)) {
    return res.status(403).json({ message: "Invalid doctor action." });
  }

  appointment.status = status;
  await appointment.save();

  if (appointment.patient.email) {
    sendEmail({
      to: appointment.patient.email,
      ...appointmentEmail({
        patientName: appointment.patient.name,
        doctorName: appointment.doctor.user.name,
        date: appointment.date,
        time: appointment.time,
        status
      })
    }).catch(console.error);
  }

  res.json(appointment);
}

export async function reschedule(req, res) {
  const { date, time } = req.body;
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email")
    .populate({ path: "doctor", populate: { path: "user", select: "name email" } });

  if (!appointment) return res.status(404).json({ message: "Appointment not found." });
  if (String(appointment.patient._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Only the patient can reschedule this appointment." });
  }
  if (appointment.status === "cancelled" || appointment.status === "rejected") {
    return res.status(400).json({ message: "This appointment cannot be rescheduled." });
  }

  const conflict = await Appointment.findOne({
    _id: { $ne: appointment._id },
    doctor: appointment.doctor._id,
    date,
    time,
    status: { $in: ["pending", "confirmed"] }
  });

  if (conflict) return res.status(409).json({ message: "That slot is already booked." });

  appointment.date = date;
  appointment.time = time;
  appointment.status = "pending";
  await appointment.save();

  res.json(appointment);
}

export async function addReview(req, res) {
  const { rating, comment = "" } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) return res.status(404).json({ message: "Appointment not found." });
  if (String(appointment.patient) !== String(req.user._id)) return res.status(403).json({ message: "Not allowed." });
  if (appointment.status !== "completed") return res.status(400).json({ message: "Review is available after completion." });
  if (appointment.review?.rating) return res.status(400).json({ message: "Review already submitted." });

  appointment.review = { rating: Number(rating), comment };
  await appointment.save();

  const doctor = await Doctor.findById(appointment.doctor);
  const reviews = await Appointment.find({ doctor: doctor._id, "review.rating": { $exists: true } }).select("review.rating");
  doctor.reviewCount = reviews.length;
  doctor.rating = reviews.length
    ? Math.round((reviews.reduce((sum, a) => sum + a.review.rating, 0) / reviews.length) * 10) / 10
    : 5;
  await doctor.save();

  res.json(appointment);
}
