import { CalendarDays, ChevronRight, Clock3, HeartPulse, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import AppointmentCard from "../components/AppointmentCard";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { formatDate } from "../lib/format";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const {user}=useAuth(); const [appointments,setAppointments]=useState([]); const [loading,setLoading]=useState(true); const [review,setReview]=useState(null); const [rating,setRating]=useState(5); const [comment,setComment]=useState("");
  async function load(){setLoading(true);try{const r=await api.get("/appointments/mine");setAppointments(r.data)}catch{toast.error("Unable to load appointments.")}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);

  async function cancel(id){if(!confirm("Cancel this appointment?"))return;try{await api.patch(`/appointments/${id}/status`,{status:"cancelled"});toast.success("Appointment cancelled.");load()}catch(e){toast.error(e.response?.data?.message||"Could not cancel.")}}
  async function submitReview(){try{await api.post(`/appointments/${review._id}/review`,{rating,comment});toast.success("Thanks for your feedback.");setReview(null);load()}catch(e){toast.error(e.response?.data?.message||"Could not submit review.")}}

  const upcoming=appointments.filter(a=>["pending","confirmed"].includes(a.status)); const past=appointments.filter(a=>["completed","cancelled","rejected"].includes(a.status));

  return <>
    <Navbar/>
    <main className="min-h-screen bg-slate-50/70 py-8">
      <div className="container-app">
        <div className="rounded-3xl bg-gradient-to-r from-ink to-slate-700 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-teal-200">Good morning, {user?.name?.split(" ")[0]}.</p><h1 className="mt-2 text-3xl font-black">Your care, all in one place.</h1><p className="mt-2 text-sm text-slate-300">Manage appointments, discover doctors and keep track of your visits.</p></div><Link to="/doctors" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-ink"><Search size={17}/> Find a doctor</Link></div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat icon={CalendarDays} label="Upcoming" value={upcoming.length}/>
          <Stat icon={Clock3} label="Past visits" value={past.length}/>
          <Stat icon={HeartPulse} label="Account" value="Active"/>
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-teal-600">Your schedule</p><h2 className="mt-1 text-2xl font-black text-ink">Upcoming appointments</h2></div><Link to="/doctors" className="text-sm font-bold text-teal-600">Book another <ChevronRight className="inline" size={15}/></Link></div>
          {loading?<div className="mt-5 h-52 animate-pulse rounded-3xl bg-white"/>:upcoming.length?<div className="mt-5 space-y-4">{upcoming.map(a=><AppointmentCard key={a._id} appointment={a} onCancel={cancel}/>)}</div>:<Empty/>}
        </section>

        <section className="mt-12">
          <div><p className="text-sm font-bold uppercase tracking-widest text-teal-600">History</p><h2 className="mt-1 text-2xl font-black text-ink">Past appointments</h2></div>
          <div className="mt-5 space-y-4">{past.length?past.map(a=><AppointmentCard key={a._id} appointment={a} onReview={setReview}/>):<div className="card p-8 text-center text-sm text-slate-500">Your completed and cancelled appointments will appear here.</div>}</div>
        </section>
      </div>
    </main>
    {review&&<div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4"><div className="card w-full max-w-md p-6"><h2 className="text-2xl font-black text-ink">How was your visit?</h2><p className="mt-1 text-sm text-slate-500">Your feedback helps other patients choose confidently.</p><div className="mt-6 flex gap-2">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} className={`grid h-12 w-12 place-items-center rounded-xl ${n<=rating?"bg-amber-100 text-amber-600":"bg-slate-50 text-slate-300"}`}>★</button>)}</div><textarea className="input mt-5 min-h-28" placeholder="Tell us about your experience (optional)" value={comment} onChange={e=>setComment(e.target.value)}/><div className="mt-5 flex gap-2"><button onClick={()=>setReview(null)} className="btn-secondary flex-1">Not now</button><button onClick={submitReview} className="btn-primary flex-1">Submit review</button></div></div></div>}
  </>;
}

function Stat({icon:Icon,label,value}){return <div className="card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600"><Icon size={20}/></span><div><p className="text-xs font-semibold text-slate-400">{label}</p><p className="mt-1 text-xl font-black text-ink">{value}</p></div></div>}
function Empty(){return <div className="card mt-5 p-10 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-600"><CalendarDays/></div><h3 className="mt-4 font-extrabold text-ink">Your calendar is clear</h3><p className="mt-1 text-sm text-slate-500">Find a doctor and book a convenient time.</p><Link className="btn-primary mt-5" to="/doctors">Browse doctors</Link></div>}
