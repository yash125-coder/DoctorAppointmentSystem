import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("medibook_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setDoctor(res.data.doctor);
      })
      .catch(() => {
        localStorage.removeItem("medibook_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const res = await api.post("/auth/login", payload);
    localStorage.setItem("medibook_token", res.data.token);
    setUser(res.data.user);
    if (res.data.user.role === "doctor") {
      const me = await api.get("/auth/me");
      setDoctor(me.data.doctor);
    }
    return res.data.user;
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("medibook_token", res.data.token);
    setUser(res.data.user);
    if (res.data.user.role === "doctor") {
      const me = await api.get("/auth/me");
      setDoctor(me.data.doctor);
    }
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem("medibook_token");
    setUser(null);
    setDoctor(null);
  }

  return (
    <AuthContext.Provider value={{ user, doctor, setDoctor, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
