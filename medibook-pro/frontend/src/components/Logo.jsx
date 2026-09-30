import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${light ? "bg-white/15 text-white" : "bg-teal-50 text-teal-600"}`}>
        <HeartPulse size={21} />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Medi<span className={light ? "text-teal-100" : "text-teal-600"}>Book</span>
      </span>
    </Link>
  );
}
