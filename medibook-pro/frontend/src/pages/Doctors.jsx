import { Filter, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoctorCard from "../components/DoctorCard";
import api from "../lib/api";

export default function Doctors() {
  const [params] = useSearchParams();
  const [doctors,setDoctors]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [specialization,setSpecialization]=useState(params.get("specialization")||"");
  const [location,setLocation]=useState("");
  const [minRating,setMinRating]=useState("");

  useEffect(()=>{setLoading(true);api.get("/doctors",{params:{search,specialization,location,minRating}}).then(r=>setDoctors(r.data)).catch(()=>{}).finally(()=>setLoading(false));},[search,specialization,location,minRating]);

  const specializations = useMemo(()=>[...new Set(doctors.map(d=>d.specialization))], [doctors]);

  return <>
    <Navbar/>
    <main className="min-h-screen bg-slate-50/70 py-10">
      <div className="container-app">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-teal-600">Find your care team</p><h1 className="mt-2 text-4xl font-black text-ink">Find a doctor you can trust.</h1><p className="mt-3 leading-7 text-slate-500">Compare specialties, experience, fees and available appointments before you book.</p></div>
        <div className="card mt-8 p-4">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_160px]">
            <label className="relative"><Search className="absolute left-4 top-3.5 text-slate-400" size={19}/><input className="input pl-11" placeholder="Search doctor or specialty" value={search} onChange={e=>setSearch(e.target.value)}/></label>
            <label className="relative"><MapPin className="absolute left-4 top-3.5 text-slate-400" size={18}/><input className="input pl-11" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/></label>
            <select className="input" value={specialization} onChange={e=>setSpecialization(e.target.value)}><option value="">All specialties</option>{specializations.map(s=><option key={s}>{s}</option>)}</select>
            <select className="input" value={minRating} onChange={e=>setMinRating(e.target.value)}><option value="">Any rating</option><option value="4.5">4.5+ rating</option><option value="4.8">4.8+ rating</option></select>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><SlidersHorizontal size={14}/> Filters update as you type.</div>
        </div>

        <div className="mt-8 flex items-center justify-between"><p className="font-bold text-ink">{loading ? "Finding doctors…" : `${doctors.length} doctor${doctors.length===1?"":"s"} available`}</p><span className="pill"><Filter size={13} className="mr-1"/> Verified profiles</span></div>
        {loading ? <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="card h-80 animate-pulse bg-white"/>)}</div>
        : doctors.length ? <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{doctors.map(d=><DoctorCard key={d._id} doctor={d}/>)}</div>
        : <div className="card mt-5 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Search/></div><h3 className="mt-4 font-extrabold text-ink">No doctors matched those filters</h3><p className="mt-1 text-sm text-slate-500">Try a broader specialty or location.</p></div>}
      </div>
    </main>
    <Footer/>
  </>;
}
