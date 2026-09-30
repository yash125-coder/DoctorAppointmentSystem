import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  listDoctors, getDoctor, getSlots, updateDoctorProfile, updateSchedule, doctorAppointments
} from "../controllers/doctorController.js";

const router = Router();

router.get("/", listDoctors);
router.get("/:id/slots", getSlots);
router.get("/:id", getDoctor);

router.patch("/profile", protect, authorize("doctor"), updateDoctorProfile);
router.patch("/schedule", protect, authorize("doctor"), updateSchedule);
router.get("/me/appointments", protect, authorize("doctor"), doctorAppointments);

export default router;
