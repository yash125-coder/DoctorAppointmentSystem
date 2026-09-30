import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import { Login, Register, ForgotPassword, ResetPassword } from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { PageLoader } from "./components/Loading";

function DashboardRedirect(){
  const {user,loading}=useAuth();
  if(loading)return <PageLoader/>;
  if(!user)return <Navigate to="/login" replace/>;
  return <Navigate to={user.role==="patient"?"/dashboard":user.role==="doctor"?"/doctor-dashboard":"/admin-dashboard"} replace/>;
}

export default function App(){
  return <AuthProvider><BrowserRouter><Toaster position="top-right" toastOptions={{duration:3500}}/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/doctors" element={<Doctors/>}/>
    <Route path="/doctors/:id" element={<DoctorProfile/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="/reset-password/:token" element={<ResetPassword/>}/>
    <Route path="/dashboard" element={<ProtectedRoute roles={["patient"]}><PatientDashboard/></ProtectedRoute>}/>
    <Route path="/doctor-dashboard" element={<ProtectedRoute roles={["doctor"]}><DoctorDashboard/></ProtectedRoute>}/>
    <Route path="/admin-dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
    <Route path="/profile" element={<DashboardRedirect/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></BrowserRouter></AuthProvider>
}
