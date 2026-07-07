import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("restauro_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem("restauro_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me")
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("restauro_user", JSON.stringify(data.user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("restauro_token");
        localStorage.removeItem("restauro_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("restauro_token", data.token);
    localStorage.setItem("restauro_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (email, password, name, phone) => {
    const data = await api.post("/api/auth/register", {
      email,
      password,
      name,
      phone,
    });
    localStorage.setItem("restauro_token", data.token);
    localStorage.setItem("restauro_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  // Establish a session directly (e.g. after the public guest request flow
  // creates an account and returns a token).
  const setSession = useCallback((sessionUser, token) => {
    localStorage.setItem("restauro_token", token);
    localStorage.setItem("restauro_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("restauro_token");
    localStorage.removeItem("restauro_user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setSession, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
