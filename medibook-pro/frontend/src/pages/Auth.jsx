import { ArrowLeft, HeartPulse, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Loading";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login({ ...form, role });
      toast.success("Welcome back.");
      navigate(user.role === "patient" ? "/dashboard" : user.role === "doctor" ? "/doctor-dashboard" : "/admin-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to sign in.");
    } finally { setBusy(false); }
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to manage your care and appointments.">
    <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-1">
      {["patient","doctor","admin"].map((r) => <button key={r} type="button" onClick={() => setRole(r)} className={`rounded-xl px-2 py-2.5 text-sm font-bold capitalize ${role === r ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"}`}>{r}</button>)}
    </div>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={form.email} onChange={v => setForm({...form,email:v})} placeholder="you@example.com"/>
      <Field label="Password" type="password" value={form.password} onChange={v => setForm({...form,password:v})} placeholder="••••••••"/>
      <div className="flex justify-end"><Link to="/forgot-password" className="text-sm font-semibold text-teal-600">Forgot password?</Link></div>
      <button disabled={busy} className="btn-primary w-full py-3.5">{busy ? <Spinner/> : "Sign in"}</button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-500">New here? <Link className="font-bold text-teal-600" to="/register">Create an account</Link></p>
  </AuthShell>;
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ name:"",email:"",password:"",phone:"",specialization:"",location:"" });
  const [busy,setBusy]=useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      const user = await register({...form,role});
      toast.success("Account created.");
      navigate(user.role === "doctor" ? "/doctor-dashboard" : "/dashboard");
    } catch(err) { toast.error(err.response?.data?.message || "Unable to create account."); }
    finally { setBusy(false); }
  }

  return <AuthShell title="Create your account" subtitle="A few details and you're ready to go.">
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1">
      {["patient","doctor"].map((r) => <button key={r} type="button" onClick={() => setRole(r)} className={`rounded-xl py-2.5 text-sm font-bold capitalize ${role === r ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"}`}>{r} account</button>)}
    </div>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Your full name"/>
      <Field label="Email" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="you@example.com"/>
      <Field label="Password" type="password" value={form.password} onChange={v=>setForm({...form,password:v})} placeholder="Minimum 8 characters"/>
      <Field label="Phone (optional)" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="+91"/>
      {role==="doctor" && <>
        <Field label="Specialization" value={form.specialization} onChange={v=>setForm({...form,specialization:v})} placeholder="e.g. Cardiology"/>
        <Field label="Clinic location" value={form.location} onChange={v=>setForm({...form,location:v})} placeholder="e.g. Baner, Pune"/>
      </>}
      <button disabled={busy} className="btn-primary w-full py-3.5">{busy ? <Spinner/> : "Create account"}</button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-teal-600" to="/login">Sign in</Link></p>
  </AuthShell>;
}

export function ForgotPassword() {
  const [email,setEmail]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);try{const r=await import("../lib/api").then(m=>m.default.post("/auth/forgot-password",{email}));toast.success(r.data.message);}catch(err){toast.error(err.response?.data?.message||"Try again.");}finally{setBusy(false);}}
  return <AuthShell title="Reset your password" subtitle="Enter your email and we'll send reset instructions."><form onSubmit={submit} className="space-y-4"><Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com"/><button disabled={busy} className="btn-primary w-full">{busy?<Spinner/>:"Send reset link"}</button></form><p className="mt-5 text-center"><Link className="text-sm font-bold text-teal-600" to="/login">Back to login</Link></p></AuthShell>;
}

export function ResetPassword() {
  const { pathname } = useLocation();
  const token = pathname.split("/").pop();
  const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);try{const api=await import("../lib/api").then(m=>m.default);const r=await api.post(`/auth/reset-password/${token}`,{password});toast.success(r.data.message);window.location="/login";}catch(err){toast.error(err.response?.data?.message||"Reset failed.");}finally{setBusy(false);}}
  return <AuthShell title="Choose a new password" subtitle="Use at least 8 characters."><form onSubmit={submit} className="space-y-4"><Field label="New password" type="password" value={password} onChange={setPassword} placeholder="••••••••"/><button disabled={busy} className="btn-primary w-full">{busy?<Spinner/>:"Update password"}</button></form></AuthShell>;
}

function AuthShell({title,subtitle,children}) {
  return <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 px-4 py-8">
    <div className="mx-auto max-w-md">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16}/> Back to MediBook</Link>
      <div className="card p-7 sm:p-9">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-600 text-white"><HeartPulse/></div>
        <h1 className="mt-6 text-3xl font-black text-ink">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
        <div className="mt-7">{children}</div>
        <div className="mt-7 flex gap-2 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 shrink-0 text-teal-600" size={16}/> Your account credentials are securely handled with hashed passwords and token-based authentication.</div>
      </div>
    </div>
  </div>
}

function Field({label,type="text",value,onChange,placeholder}) {
  return <label className="block"><span className="label">{label}</span><input required className="input" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>
}
