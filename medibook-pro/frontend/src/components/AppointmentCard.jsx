import { CalendarDays, Clock3, MapPin, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../lib/format";

export default function AppointmentCard({ appointment, onCancel, onComplete, onReview }) {
  const doctor = appointment.doctor;
  const name = doctor?.user?.name || "Doctor";
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-teal-50 text-teal-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-slate-100 text-slate-500",
    rejected: "bg-rose-50 text-rose-700"
  };

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[appointment.status] || "bg-slate-100 text-slate-600"}`}>
            {appointment.status}
          </span>
          <h3 className="mt-3 text-lg font-extrabold text-ink">Dr. {name}</h3>
          <p className="mt-1 text-sm font-semibold text-teal-700">{doctor?.specialization}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3"><CalendarDays size={16} className="mb-1 text-teal-600"/><b>{formatDate(appointment.date)}</b></div>
          <div className="rounded-2xl bg-slate-50 p-3"><Clock3 size={16} className="mb-1 text-teal-600"/><b>{appointment.time}</b></div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16}/> {doctor?.location} · {formatCurrency(doctor?.fees)}</p>
        <div className="flex flex-wrap gap-2">
          {["pending", "confirmed"].includes(appointment.status) && onCancel && (
            <button onClick={() => onCancel(appointment._id)} className="flex items-center gap-1 rounded-xl border border-rose-100 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"><XCircle size={16}/> Cancel</button>
          )}
          {appointment.status === "confirmed" && onComplete && (
            <button onClick={() => onComplete(appointment._id)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Mark completed</button>
          )}
          {appointment.status === "completed" && !appointment.review?.rating && onReview && (
            <button onClick={() => onReview(appointment)} className="rounded-xl bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Leave a review</button>
          )}
        </div>
      </div>
    </div>
  );
}
