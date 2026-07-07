import { useState, useEffect } from "react";
import api from "../../api";
import Layout from "../../components/Layout";
import { Card, Eyebrow, Input, Icon, Badge } from "../../ds";
import { formatDate } from "../../lib/artTypes";

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/api/admin/clients")
      .then((data) => setClients(data.clients))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) =>
    !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Layout title="Kunden & Archiv">
      <Eyebrow>Kundenverzeichnis</Eyebrow>
      <h1 className="rst-page-title">Kunden & Archiv</h1>

      <div style={{ maxWidth: 320, marginBottom: 20 }}>
        <Input placeholder="Kunden suchen…" icon={<Icon name="search" size={16} />} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="rst-center-load">Laden…</div>
      ) : filtered.length === 0 ? (
        <Card variant="outline"><div className="rst-empty"><p>Keine Kunden gefunden.</p></div></Card>
      ) : (
        <Card variant="outline" padding="none">
          <div className="rst-table-wrap">
            <table className="rst-table">
              <thead>
                <tr>
                  <th>Kunde</th>
                  <th className="col-hide-sm">Kontakt</th>
                  <th style={{ textAlign: "right" }}>Projekte</th>
                  <th style={{ textAlign: "right" }}>Aktiv</th>
                  <th className="col-hide-sm" style={{ textAlign: "right" }}>Registriert</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ cursor: "default" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="rst-avatar" style={{ background: "var(--patina-400)" }}>{initials(c.name)}</div>
                        <div>
                          <div className="rst-table__link">{c.name}</div>
                          <div className="rst-muted" style={{ fontSize: 12 }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="col-hide-sm rst-muted" style={{ fontSize: 13 }}>
                      {c.phone || "—"}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{c.request_count}</td>
                    <td style={{ textAlign: "right" }}>
                      {c.active_count > 0 ? <Badge tone="success" dot>{c.active_count}</Badge> : <span className="rst-muted">—</span>}
                    </td>
                    <td className="col-hide-sm rst-muted" style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                      {formatDate(c.created_at)}
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
