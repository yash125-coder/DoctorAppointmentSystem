import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6 },
  start: { type: String, required: true },
  end: { type: String, required: true },
  enabled: { type: Boolean, default: true }
}, { _id: false });

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    qualifications: [{ type: String }],
    experience: { type: Number, default: 0, min: 0 },
    bio: { type: String, maxlength: 1200, default: "" },
    fees: { type: Number, default: 0, min: 0 },
    photo: { type: String, default: "" },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    consultationMode: { type: String, enum: ["Clinic", "Video", "Both"], default: "Clinic" },
    schedule: { type: [slotSchema], default: [] },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 1, location: 1 });

export default mongoose.model("Doctor", doctorSchema);
