import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { stats, users, doctors, createDoctor, updateDoctor, deleteDoctor, appointments } from "../controllers/adminController.js";

const router = Router();
router.use(protect, authorize("admin"));

router.get("/stats", stats);
router.get("/users", users);
router.get("/doctors", doctors);
router.post("/doctors", createDoctor);
router.patch("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);
router.get("/appointments", appointments);

export default router;
