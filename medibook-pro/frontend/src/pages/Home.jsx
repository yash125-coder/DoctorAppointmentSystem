import { ArrowRight, BadgeCheck, CalendarCheck2, ChevronRight, Clock3, HeartHandshake, Search, ShieldCheck, Star, Stethoscope, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoctorCard from "../components/DoctorCard";
import { useEffect, useState } from "react";
import api from "../lib/api";

const specializations = [
  ["Cardiology", "Heart & vascular care", "♥"],
  ["Dermatology", "Skin, hair & nails", "✦"],
  ["Dentistry", "Teeth & oral health", "✚"],
  ["Pediatrics", "Care for little ones", "♡"],
  ["Orthopedics", "Bones & joints", "⌁"],
  ["Neurology", "Brain & nervous system", "◌"]
];

const testimonials = [
  { quote: "The booking process felt surprisingly simple. I found a dermatologist and had my appointment confirmed in minutes.", name: "Aarohi Mehta", role: "MediBook patient" },
  { quote: "I could see the doctor's experience, fees and available slots before deciding. It made the whole process feel transparent.", name: "Rohan Kulkarni", role: "MediBook patient" },
  { quote: "The interface is clean and I never had to hunt around to understand what I needed to do next.", name: "Nisha Shah", role: "MediBook patient" }
];

export default function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get("/doctors").then((r) => setDoctors(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white">
          <div className="container-app grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <div>
              <span className="pill"><BadgeCheck size={14} className="mr-1"/> Trusted care, thoughtfully connected</span>
              <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-ink sm:text-6xl">
                Healthcare that fits into <span className="text-teal-600">your life.</span>
              </motion.h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Find the right doctor, see transparent fees and available times, and book without the usual back-and-forth.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/doctors" className="btn-primary px-6 py-3.5">Book an Appointment <ArrowRight size={18}/></Link>
                <a href="#how-it-works" className="btn-secondary px-6 py-3.5">How it works</a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-2"><ShieldCheck className="text-teal-600" size={18}/> Secure accounts</span>
                <span className="flex items-center gap-2"><CalendarCheck2 className="text-teal-600" size={18}/> Live slot availability</span>
                <span className="flex items-center gap-2"><HeartHandshake className="text-teal-600" size={18}/> Patient-first design</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl"/>
              <div className="card relative overflow-hidden p-5 sm:p-7">
                <div className="rounded-3xl bg-gradient-to-br from-ink to-slate-700 p-7 text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Your care, organized</span>
                    <HeartHandshake size={25}/>
                  </div>
                  <div className="mt-16">
              
             </div>
            </div>
          </div>
        </section>

        <section id="specializations" className="container-app py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-sm font-bold uppercase tracking-widest text-teal-600">Explore care</p><h2 className="mt-2 text-3xl font-black text-ink">What can we help with?</h2></div>
            <Link to="/doctors" className="font-bold text-teal-600">View all doctors <ChevronRight className="inline" size={17}/></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map(([title, desc, icon]) => (
              <Link key={title} to={`/doctors?specialization=${title}`} className="group card flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-teal-100">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal-50 text-2xl text-teal-600">{icon}</span>
                <div><h3 className="font-extrabold text-ink">{title}</h3><p className="mt-1 text-sm text-slate-500">{desc}</p></div>
                <ArrowRight className="ml-auto text-slate-300 transition group-hover:text-teal-600" size={19}/>
              </Link>
            ))}
          </div>
        </section>

        <section id="doctors" className="bg-slate-50/70 py-20">
          <div className="container-app">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-sm font-bold uppercase tracking-widest text-teal-600">Meet your doctors</p><h2 className="mt-2 text-3xl font-black text-ink">Featured specialists</h2></div>
              <Link to="/doctors" className="hidden font-bold text-teal-600 sm:block">Browse doctors <ArrowRight className="inline" size={17}/></Link>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {doctors.length ? doctors.map((d) => <DoctorCard key={d._id} doctor={d}/>) : [1,2,3].map((x) => <div key={x} className="card h-80 animate-pulse bg-slate-100"/>)}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="container-app py-20">
          <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-teal-600">Simple by design</p><h2 className="mt-2 text-3xl font-black text-ink">From search to appointment in three steps</h2></div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [Search, "Find the right doctor", "Search by specialty, location, experience or rating."],
              [CalendarCheck2, "Choose a time", "See live availability and select a slot that works for you."],
              [HeartHandshake, "Get the care you need", "Receive updates, manage your appointment and share feedback."]
            ].map(([Icon, title, desc], i) => (
              <div key={title} className="card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-600"><Icon size={23}/></span>
                <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-400">0{i+1}</span>
                <h3 className="mt-2 text-xl font-extrabold text-ink">{title}</h3>
                <p className="mt-2 leading-7 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink py-20 text-white">
          <div className="container-app">
            <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-teal-300">Patient stories</p><h2 className="mt-2 text-3xl font-black">Care should feel this straightforward.</h2></div></div>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex gap-1 text-amber-300">{[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor"/>)}</div>
                  <p className="mt-5 leading-7 text-slate-200">“{t.quote}”</p>
                  <div className="mt-7"><p className="font-bold">{t.name}</p><p className="text-sm text-slate-400">{t.role}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
