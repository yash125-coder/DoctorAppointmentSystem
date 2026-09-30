import { Menu, X, LogOut, LayoutDashboard, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function doLogout() {
    logout();
    navigate("/");
  }

  const dashboardPath = user?.role === "doctor" ? "/doctor-dashboard" : user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-app flex h-18 items-center justify-between py-3">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          <Link className="text-sm font-semibold text-slate-600 hover:text-teal-600" to="/">Home</Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-teal-600" to="/doctors">Find a Doctor</Link>
          {user && <Link className="text-sm font-semibold text-slate-600 hover:text-teal-600" to={dashboardPath}>Dashboard</Link>}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <UserRound size={17} /> {user.name?.split(" ")[0]}
              </Link>
              <button onClick={doLogout} className="btn-secondary px-4 py-2.5 text-sm"><LogOut size={16}/> Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600">Log in</Link>
              <Link to="/register" className="btn-primary px-4 py-2.5 text-sm">Create account</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-xl p-2 md:hidden">
          {open ? <X/> : <Menu/>}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white p-4 md:hidden">
          <div className="container-app flex flex-col gap-2">
            <Link onClick={() => setOpen(false)} className="rounded-xl p-3 font-semibold" to="/">Home</Link>
            <Link onClick={() => setOpen(false)} className="rounded-xl p-3 font-semibold" to="/doctors">Find a Doctor</Link>
            {user && <Link onClick={() => setOpen(false)} className="rounded-xl p-3 font-semibold" to={dashboardPath}>Dashboard</Link>}
            {user ? (
              <button onClick={doLogout} className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-left font-semibold"><LogOut size={17}/> Sign out</button>
            ) : (
              <Link onClick={() => setOpen(false)} className="btn-primary mt-2" to="/register">Create account</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
