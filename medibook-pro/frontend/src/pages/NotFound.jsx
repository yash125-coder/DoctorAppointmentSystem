import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound(){return <><Navbar/><div className="container-app grid min-h-[65vh] place-items-center py-16 text-center"><div><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-600"><SearchX/></div><h1 className="mt-6 text-4xl font-black text-ink">We couldn't find that page.</h1><p className="mt-2 text-slate-500">The page may have moved or the link may be outdated.</p><Link className="btn-primary mt-6" to="/"><Home size={17}/> Back home</Link></div></div></>}
