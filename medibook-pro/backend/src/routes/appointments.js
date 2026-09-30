import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createAppointment, myAppointments, updateStatus, reschedule, addReview
} from "../controllers/appointmentController.js";

const router = Router();

router.use(protect);
router.post("/", authorize("patient"), createAppointment);
router.get("/mine", authorize("patient"), myAppointments);
router.patch("/:id/status", updateStatus);
router.patch("/:id/reschedule", authorize("patient"), reschedule);
router.post("/:id/review", authorize("patient"), addReview);

export default router;
