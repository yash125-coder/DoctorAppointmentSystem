import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./Loading";

function dashboardPathFor(role) {
  if (role === "doctor") return "/doctor-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/dashboard";
}

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={dashboardPathFor(user.role)} replace />;
  return children;
}
