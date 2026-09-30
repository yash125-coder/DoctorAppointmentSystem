import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, maxlength: 600 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD in clinic timezone
    time: { type: String, required: true }, // HH:mm
    reason: { type: String, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending"
    },
    review: reviewSchema
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });
appointmentSchema.index({ patient: 1, date: 1 });

export default mongoose.model("Appointment", appointmentSchema);
