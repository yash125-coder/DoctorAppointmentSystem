import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-slate-300">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Making quality healthcare easier to discover, schedule and manage.
            MediBook connects patients with trusted healthcare professionals through a simple digital experience.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-white">Platform</h3>
          <div className="mt-4 space-y-3 text-sm">
            <a href="#specializations" className="block hover:text-white">Specializations</a>
            <a href="#doctors" className="block hover:text-white">Featured doctors</a>
            <a href="#how-it-works" className="block hover:text-white">How it works</a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Contact</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex gap-2"><MapPin size={17}/> Pune, Maharashtra</p>
            <p className="flex gap-2"><Phone size={17}/> +91 20 4000 2026</p>
            <p className="flex gap-2"><Mail size={17}/> hello@medibook.example</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-app flex flex-col justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} MediBook Pro. All rights reserved.</span>
          <span>Designed for a calmer healthcare journey.</span>
        </div>
      </div>
    </footer>
  );
}
