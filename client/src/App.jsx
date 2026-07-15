import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PublicRequestPage from "./pages/PublicRequestPage";
import ImpressumPage from "./pages/ImpressumPage";
import TeamPage from "./pages/TeamPage";
import WerkstattPage from "./pages/WerkstattPage";
import ReferencesPage from "./pages/ReferencesPage";
import DashboardPage from "./pages/client/DashboardPage";
import NewRequestPage from "./pages/client/NewRequestPage";
import RequestDetailPage from "./pages/client/RequestDetailPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRequestDetailPage from "./pages/admin/AdminRequestDetailPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="rst-center-load">Laden…</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/impressum" element={<ImpressumPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/werkstatt" element={<WerkstattPage />} />
      <Route path="/referenzen" element={<ReferencesPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
      />
      <Route
        path="/anfrage"
        element={user ? <Navigate to="/requests/new" /> : <PublicRequestPage />}
      />

      {/* Client */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/new"
        element={
          <ProtectedRoute>
            <NewRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute adminOnly>
            <AdminClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminRequestDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
