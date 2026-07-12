import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Layout from "../../components/Layout";
import { Button, ButtonLink, Card, Tabs, Eyebrow, Icon, Plate, ProgressBar } from "../../ds";
import { StatusBadge, statusProgress, STATUS_STAGE, refId, toneFor } from "../../ds/status";
import { artTypeLabel } from "../../lib/artTypes";

const ACTIVE = ["new", "quoted", "accepted", "in_progress"];

function Stat({ label, value, sub, icon }) {
  return (
    <Card variant="outline">
      <div className="rst-between" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="rst-stat__label">{label}</div>
          <div className="rst-stat__value">{value}</div>
          <div className="rst-stat__sub">{sub}</div>
        </div>
        <div className="rst-stat__icon"><Icon name={icon} size={20} /></div>
      </div>
    </Card>
  );
}

function ProjectRow({ req }) {
  return (
    <Link to={`/requests/${req.id}`} className="rst-row">
      <div className="rst-row__thumb"><Plate ratio="1/1" tone={toneFor(req.id)} /></div>
      <div style={{ minWidth: 0 }}>
        <div className="rst-row__title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.title}</div>
        <div className="rst-row__sub">
          {artTypeLabel(req.art_type) || "Objekt"} · {req.image_count} Bild{req.image_count !== 1 ? "er" : ""}
        </div>
      </div>
      <div className="rst-row__ref">{refId(req)}</div>
      <div className="rst-row__progresscol">
        <ProgressBar value={statusProgress(req.status)} size="sm" done={req.status === "completed"} />
        <div className="rst-row__stage">{STATUS_STAGE[req.status]}</div>
      </div>
      <div style={{ justifySelf: "start" }}><StatusBadge status={req.status} /></div>
      <Icon name="chevron-right" size={16} className="rst-row__chev" style={{ color: "var(--text-muted)" }} />
    </Link>
  );
}

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/requests")
      .then((data) => setRequests(data.requests))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = requests.filter((r) => ACTIVE.includes(r.status));
  const review = requests.filter((r) => r.status === "quoted");
  const done = requests.filter((r) => r.status === "completed");
  const shown = tab === "active" ? active : tab === "review" ? review : done;

  const today = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Layout
      title="Übersicht"
      actions={<ButtonLink as={Link} to="/requests/new" size="sm" startIcon={<Icon name="plus" size={15} />}>Neue Anfrage</ButtonLink>}
    >
      <Eyebrow>{today}</Eyebrow>
      <h1 className="rst-page-title">Meine Objekte</h1>

      <div className="rst-stats">
        <Stat label="Aktiv" value={active.length} sub={review.length ? `${review.length} benötigt Ihre Freigabe` : "In Bearbeitung"} icon="brush" />
        <Stat label="Gesamt" value={requests.length} sub="Anfragen insgesamt" icon="frame" />
        <Stat label="Abgeschlossen" value={done.length} sub="Fertiggestellte Objekte" icon="check-circle" />
      </div>

      <div className="rst-toolbar">
        <Tabs value={tab} onChange={setTab} items={[
          { value: "active", label: "Aktiv", count: active.length },
          { value: "review", label: "In Prüfung", count: review.length },
          { value: "done", label: "Abgeschlossen", count: done.length },
        ]} />
        <ButtonLink as={Link} to="/requests/new" size="sm" variant="outline" startIcon={<Icon name="plus" size={15} />}>Neue Anfrage</ButtonLink>
      </div>

      {loading ? (
        <div className="rst-center-load">Laden…</div>
      ) : requests.length === 0 ? (
        <Card variant="outline">
          <div className="rst-empty">
            <p>Sie haben noch keine Anfragen gestellt.</p>
            <Button onClick={() => navigate("/requests/new")} startIcon={<Icon name="plus" size={15} />}>Erste Anfrage stellen</Button>
          </div>
        </Card>
      ) : shown.length === 0 ? (
        <Card variant="outline"><div className="rst-empty"><p>Keine Objekte in dieser Ansicht.</p></div></Card>
      ) : (
        <Card variant="outline" padding="sm">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {shown.map((req) => <ProjectRow key={req.id} req={req} />)}
          </div>
        </Card>
      )}
    </Layout>
  );
}
