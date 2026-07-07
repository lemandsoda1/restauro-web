import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="rst-center-load">Laden…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin")
    return <Navigate to="/dashboard" replace />;

  return children;
}
