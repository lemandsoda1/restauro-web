import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Layout from "../../components/Layout";
import { Card, Tabs, Eyebrow, Icon } from "../../ds";
import { StatusBadge, refId } from "../../ds/status";
import { artTypeLabel, formatDate } from "../../lib/artTypes";

function Stat({ label, value, icon }) {
  return (
    <Card variant="outline">
      <div className="rst-between" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="rst-stat__label">{label}</div>
          <div className="rst-stat__value" style={{ fontSize: 32 }}>{value}</div>
        </div>
        <div className="rst-stat__icon"><Icon name={icon} size={20} /></div>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/api/admin/requests"), api.get("/api/admin/stats")])
      .then(([reqData, statsData]) => { setRequests(reqData.requests); setStats(statsData); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const countBy = (s) => (stats?.byStatus?.find((x) => x.status === s)?.count) || 0;
  const filtered = filter ? requests.filter((r) => r.status === filter) : requests;

  const filterItems = [
    { value: "", label: "Alle", count: requests.length },
    { value: "new", label: "Neu", count: countBy("new") },
    { value: "quoted", label: "Angebot", count: countBy("quoted") },
    { value: "accepted", label: "Angenommen", count: countBy("accepted") },
    { value: "in_progress", label: "In Arbeit", count: countBy("in_progress") },
    { value: "completed", label: "Fertig", count: countBy("completed") },
  ];

  return (
    <Layout title="Dashboard">
      <Eyebrow>Atelier-Übersicht</Eyebrow>
      <h1 className="rst-page-title">Anfragen & Aufträge</h1>

      {stats && (
        <div className="rst-adminstats">
          <Stat label="Gesamt" value={stats.total} icon="frame" />
          <Stat label="Neu" value={countBy("new")} icon="sparkles" />
          <Stat label="In Bearbeitung" value={countBy("in_progress")} icon="brush" />
          <Stat label="Abgeschlossen" value={countBy("completed")} icon="check-circle" />
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <Tabs value={filter} onChange={setFilter} items={filterItems} />
      </div>

      {loading ? (
        <div className="rst-center-load">Laden…</div>
      ) : filtered.length === 0 ? (
        <Card variant="outline"><div className="rst-empty"><p>Keine Anfragen in dieser Ansicht.</p></div></Card>
      ) : (
        <Card variant="outline" padding="none">
          <div className="rst-table-wrap">
            <table className="rst-table">
              <thead>
                <tr>
                  <th>Objekt</th>
                  <th className="col-hide-sm">Referenz</th>
                  <th className="col-hide-sm">Kunde</th>
                  <th>Status</th>
                  <th className="col-hide-sm" style={{ textAlign: "right" }}>Bilder</th>
                  <th style={{ textAlign: "right" }}>Preis</th>
                  <th className="col-hide-sm" style={{ textAlign: "right" }}>Eingegangen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id} onClick={() => navigate(`/admin/requests/${req.id}`)}>
                    <td>
                      <div className="rst-table__link">{req.title}</div>
                      <div className="rst-muted" style={{ fontSize: 12 }}>{artTypeLabel(req.art_type)}</div>
                    </td>
                    <td className="col-hide-sm rst-table__ref">{refId(req)}</td>
                    <td className="col-hide-sm">{req.client_name}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td className="col-hide-sm rst-muted" style={{ textAlign: "right" }}>{req.image_count}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {req.latest_price != null ? `${req.latest_price.toFixed(0)} €` : "—"}
                    </td>
                    <td className="col-hide-sm rst-muted" style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                      {formatDate(req.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Layout>
  );
}
