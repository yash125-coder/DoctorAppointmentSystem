import { CalendarDays, CheckCircle2, Clock3, MapPin, ShieldCheck, Star, Stethoscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { formatCurrency, formatDate, getInitials, todayISO } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Loading";

export default function DoctorProfile() {
  const { id } = useParams(); const navigate=useNavigate(); const {user}=useAuth();
  const [doctor,setDoctor]=useState(null); const [date,setDate]=useState(todayISO()); const [slots,setSlots]=useState([]); const [selected,setSelected]=useState(""); const [reason,setReason]=useState(""); const [busy,setBusy]=useState(false); const [loading,setLoading]=useState(true);

  useEffect(()=>{api.get(`/doctors/${id}`).then(r=>setDoctor(r.data)).catch(()=>toast.error("Doctor not found")).finally(()=>setLoading(false));},[id]);
  useEffect(()=>{if(!doctor)return;api.get(`/doctors/${id}/slots`,{params:{date}}).then(r=>{setSlots(r.data.slots);setSelected("");}).catch(()=>setSlots([]));},[id,date,doctor]);

  const dayName=useMemo(()=>new Intl.DateTimeFormat("en-IN",{weekday:"long"}).format(new Date(`${date}T00:00:00`)),[date]);

  async function book() {
    if(!user){navigate("/login");return;}
    if(user.role!=="patient"){toast.error("Only patient accounts can book appointments.");return;}
    if(!selected){toast.error("Please choose a time slot.");return;}
    setBusy(true);
    try{await api.post("/appointments",{doctorId:id,date,time:selected,reason});toast.success("Appointment request sent.");navigate("/dashboard");}
    catch(err){toast.error(err.response?.data?.message||"Booking failed. Please refresh and try again.");}
    finally{setBusy(false);}
  }

  if(loading) return <><Navbar/><div className="container-app py-20"><div className="card h-96 animate-pulse bg-white"/></div></>;
  if(!doctor) return null;
  const name=doctor.user?.name||"Doctor";

  return <>
    <Navbar/>
    <main className="min-h-screen bg-slate-50/70 py-8">
      <div className="container-app">
        <div className="card overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-ink via-slate-700 to-teal-700"/>
          <div className="-mt-16 px-6 pb-7 sm:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {doctor.photo||doctor.user?.avatar?<img src={doctor.photo||doctor.user.avatar} className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg"/>:<div className="grid h-32 w-32 place-items-center rounded-3xl border-4 border-white bg-teal-600 text-3xl font-black text-white shadow-lg">{getInitials(name)}</div>}
                <div className="pb-1"><div className="flex items-center gap-2"><h1 className="text-3xl font-black text-ink">Dr. {name}</h1>{doctor.verified&&<CheckCircle2 className="text-teal-600" size={21}/>}</div><p className="mt-1 font-bold text-teal-700">{doctor.specialization}</p><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{doctor.location}</p></div>
              </div>
              <div className="flex gap-2"><span className="pill"><Star size={13} className="mr-1 fill-current"/>{doctor.rating} ({doctor.reviewCount} reviews)</span><span className="pill"><ShieldCheck size={13} className="mr-1"/> Verified</span></div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_390px]">
              <div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Info icon={Stethoscope} label="Experience" value={`${doctor.experience}+ years`}/>
                  <Info icon={CalendarDays} label="Consultation" value={doctor.consultationMode}/>
                  <Info icon={Clock3} label="Fees" value={`${formatCurrency(doctor.fees)} / visit`}/>
                </div>
                <div className="mt-8"><h2 className="text-xl font-black text-ink">About the doctor</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">{doctor.bio||"Experienced healthcare professional focused on clear communication, evidence-based care and a comfortable patient experience."}</p></div>
                <div className="mt-8"><h2 className="text-xl font-black text-ink">Qualifications</h2><div className="mt-3 flex flex-wrap gap-2">{(doctor.qualifications?.length?doctor.qualifications:["MBBS","MD / equivalent specialist training"]).map(q=><span key={q} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">{q}</span>)}</div></div>
              </div>

              <div className="card border-teal-100 p-5 shadow-none">
                <h2 className="text-xl font-black text-ink">Choose an appointment</h2>
                <p className="mt-1 text-sm text-slate-500">{dayName}, {formatDate(date)}</p>
                <label className="label mt-5">Date<input min={todayISO()} className="input mt-2" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
                <p className="mt-5 text-sm font-bold text-slate-700">Available times</p>
                <div className="mt-3 grid grid-cols-3 gap-2">{slots.length?slots.map(s=><button key={s.time} disabled={!s.available} onClick={()=>setSelected(s.time)} className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition ${!s.available?"cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300":selected===s.time?"border-teal-600 bg-teal-600 text-white":"border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50"}`}>{s.time}</button>):<p className="col-span-3 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No slots available on this date.</p>}</div>
                <textarea className="input mt-4 min-h-24 resize-none" placeholder="Reason for visit (optional)" value={reason} onChange={e=>setReason(e.target.value)}/>
                <button disabled={busy||!selected} onClick={book} className="btn-primary mt-4 w-full">{busy?<Spinner/>:"Request appointment"} </button>
                <p className="mt-3 text-center text-xs leading-5 text-slate-400">You'll receive an email update when your appointment is processed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>;
}

function Info({icon:Icon,label,value}){return <div className="rounded-2xl bg-slate-50 p-4"><Icon size={18} className="text-teal-600"/><p className="mt-2 text-xs font-semibold text-slate-400">{label}</p><p className="mt-1 font-extrabold text-ink">{value}</p></div>}
