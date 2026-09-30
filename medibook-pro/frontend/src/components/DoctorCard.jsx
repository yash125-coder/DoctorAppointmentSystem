import { ArrowRight, MapPin, Star, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency, getInitials } from "../lib/format";

export default function DoctorCard({ doctor }) {
  const name = doctor.user?.name || "Doctor";
  return (
    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden">
      <div className="h-28 bg-gradient-to-br from-teal-50 via-white to-sky-50" />
      <div className="-mt-12 px-5 pb-5">
        {doctor.photo || doctor.user?.avatar ? (
          <img src={doctor.photo || doctor.user.avatar} className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-md" />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-3xl border-4 border-white bg-teal-600 text-2xl font-extrabold text-white shadow-md">
            {getInitials(name)}
          </div>
        )}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Dr. {name}</h3>
            <p className="mt-1 text-sm font-semibold text-teal-700">{doctor.specialization}</p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700"><Star size={14} fill="currentColor"/> {doctor.rating || "4.8"}</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2"><MapPin size={16}/> {doctor.location}</p>
          <p className="flex items-center gap-2"><Stethoscope size={16}/> {doctor.experience || 0}+ years experience</p>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="font-bold text-ink">{formatCurrency(doctor.fees)} <span className="font-normal text-slate-400">/ visit</span></span>
          <Link to={`/doctors/${doctor._id}`} className="flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700">View profile <ArrowRight size={16}/></Link>
        </div>
      </div>
    </motion.div>
  );
}
