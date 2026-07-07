import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Icon, IconButton, Breadcrumbs } from "../ds";

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

export default function Layout({ title, crumbs, actions, children }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const nav = isAdmin
    ? [
        ["/admin", "layout-dashboard", "Dashboard"],
        ["/admin/clients", "users", "Kunden & Archiv"],
      ]
    : [
        ["/dashboard", "layout-dashboard", "Übersicht"],
        ["/requests/new", "plus", "Neue Anfrage"],
      ];

  const isActive = (to) =>
    location.pathname === to ||
    (to === "/dashboard" && location.pathname.startsWith("/requests/") && location.pathname !== "/requests/new") ||
    (to === "/admin" && location.pathname.startsWith("/admin/requests"));

  return (
    <div className="rst-portal">
      {/* Sidebar (desktop) */}
      <aside className="rst-sidebar">
        <Link to="/" className="rst-sidebar__brand rst-wordmark">Westermeier<span className="dot">.</span></Link>
        <nav className="rst-sidebar__nav">
          {nav.map(([to, ic, label]) => (
            <Link key={to} to={to} className={`rst-navitem${isActive(to) ? " rst-navitem--active" : ""}`}>
              <Icon name={ic} size={18} stroke={isActive(to) ? 2 : 1.6} />{label}
            </Link>
          ))}
        </nav>
        <div className="rst-sidebar__user">
          <div className="rst-sidebar__user-row">
            <div className="rst-avatar" style={isAdmin ? { background: "var(--royal-500)" } : undefined}>{initials(user?.name)}</div>
            <div style={{ lineHeight: 1.2, minWidth: 0 }}>
              <div className="rst-sidebar__user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
              <div className="rst-sidebar__user-sub">{isAdmin ? "Restaurator" : "Sammlung"}</div>
            </div>
          </div>
          <button className="rst-navitem" style={{ width: "100%", marginTop: 4 }} onClick={handleLogout}>
            <Icon name="log-out" size={18} />Abmelden
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="rst-main">
        <div className="rst-topbar">
          <div style={{ minWidth: 0 }}>
            {crumbs ? <Breadcrumbs items={crumbs} /> : <div className="rst-topbar__title">{title}</div>}
          </div>
          <div className="rst-topbar__actions">
            {actions}
            <IconButton label="Abmelden" variant="ghost" onClick={handleLogout}><Icon name="log-out" size={19} /></IconButton>
          </div>
        </div>

        <div className="rst-content">{children}</div>

        {/* Bottom nav (mobile) */}
        <nav className="rst-bottomnav">
          {nav.map(([to, ic, label]) => (
            <Link key={to} to={to} className={`rst-bottomnav__item${isActive(to) ? " rst-bottomnav__item--active" : ""}`}>
              <Icon name={ic} size={20} stroke={isActive(to) ? 2.1 : 1.7} /><span>{label.split(" ")[0]}</span>
            </Link>
          ))}
          <button className="rst-bottomnav__item" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon name="log-out" size={20} /><span>Abmelden</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
