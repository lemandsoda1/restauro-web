import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Layout from "../../components/Layout";
import { Button, Card, Tabs, Icon, Plate, ProgressBar } from "../../ds";
import { StatusBadge, statusProgress, STATUS_STAGE, STATUS_LABELS, refId, toneFor } from "../../ds/status";
import { artTypeLabel, formatDate } from "../../lib/artTypes";

function buildTimeline(req, offers) {
  const s = req.status;
  const hasOffer = offers.length > 0;
  const st = (cond) => (cond === "done" ? "done" : cond === "active" ? "active" : "todo");
  return [
    { title: "Anfrage eingegangen", date: formatDate(req.created_at), state: "done" },
    { title: "Angebot erstellt", date: hasOffer ? "Erledigt" : "Ausstehend", state: st(hasOffer ? "done" : s === "new" ? "active" : "todo") },
    { title: "Angebot freigegeben", date: s === "declined" ? "Abgelehnt" : ["accepted", "in_progress", "completed"].includes(s) ? "Erledigt" : "Ausstehend",
      state: ["accepted", "in_progress", "completed"].includes(s) ? "done" : s === "quoted" ? "active" : "todo" },
    { title: "In Bearbeitung", date: s === "completed" ? "Erledigt" : s === "in_progress" ? "Läuft" : "Ausstehend",
      state: s === "completed" ? "done" : s === "in_progress" ? "active" : "todo" },
    { title: "Fertiggestellt", date: s === "completed" ? "Erledigt" : "Ausstehend", state: s === "completed" ? "done" : "todo" },
  ];
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [tab, setTab] = useState("overview");

  const load = () => {
    api.get(`/api/requests/${id}`).then(setData).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const respond = async (offerId, action) => {
    setResponding(true);
    try { await api.patch(`/api/offers/${offerId}/respond`, { action }); load(); }
    catch { /* ignore */ } finally { setResponding(false); }
  };

  if (loading) return <Layout title="Werk"><div className="rst-center-load">Laden…</div></Layout>;
  if (!data) return <Layout title="Werk"><div className="rst-center-load">Anfrage nicht gefunden.</div></Layout>;

  const { request: req, images, offers } = data;
  const pendingOffer = offers.find((o) => o.status === "pending");
  const acceptedOffer = offers.find((o) => o.status === "accepted");
  const heroImage = images[0];
  const crumbs = [
    { label: "Übersicht", onClick: () => navigate("/dashboard") },
    { label: req.title },
  ];

  return (
    <Layout crumbs={crumbs}>
      {/* Hero */}
      <div className="rst-detail-hero">
        <div className="rst-detail-hero__img">
          {heroImage
            ? <img src={heroImage.url} alt={req.title} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            : <Plate ratio="4/5" tone={toneFor(req.id)} label="Aktueller Zustand" />}
        </div>
        <div>
          <div className="rst-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="rst-detail-hero__ref">{refId(req)}</div>
              <h1 className="rst-detail-hero__title">{req.title}</h1>
              <div className="rst-detail-hero__sub">{artTypeLabel(req.art_type) || "Objekt"}</div>
            </div>
            <StatusBadge status={req.status} />
          </div>

          {pendingOffer && (
            <div className="rst-detail-hero__actions">
              <Button startIcon={<Icon name="check" size={15} />} onClick={() => setTab("offers")}>Angebot prüfen & freigeben</Button>
            </div>
          )}

          <div className="rst-mt-6">
            <div className="rst-between" style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 6 }}>
              <span>Fortschritt</span>
              <span>{statusProgress(req.status)}% · {STATUS_STAGE[req.status]}</span>
            </div>
            <ProgressBar value={statusProgress(req.status)} done={req.status === "completed"} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rst-mt-8">
        <Tabs value={tab} onChange={setTab} items={[
          { value: "overview", label: "Übersicht" },
          { value: "photos", label: "Fotos", count: images.length },
          { value: "timeline", label: "Verlauf" },
          { value: "offers", label: "Angebote", count: offers.length },
        ]} />

        <div style={{ padding: "28px 0" }}>
          {tab === "overview" && (
            <div className="rst-two-col">
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, margin: "0 0 10px" }}>Beschreibung</h3>
                <p className="rst-prose" style={{ maxWidth: "58ch" }}>
                  {req.description || "Für dieses Werk wurde keine Beschreibung hinterlegt."}
                </p>
              </div>
              <Card variant="elevated">
                <div className="rst-detail-meta__label">Details</div>
                {[
                  ["Objektart", artTypeLabel(req.art_type) || "—"],
                  ["Fotos", String(images.length)],
                  ["Eingegangen", formatDate(req.created_at)],
                  ["Status", STATUS_LABELS[req.status] || req.status],
                  ...(acceptedOffer ? [["Preis", `${acceptedOffer.price.toFixed(2)} ${acceptedOffer.currency}`]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="rst-detail-meta__row">
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {tab === "photos" && (
            images.length === 0
              ? <p className="rst-muted">Keine Fotos vorhanden.</p>
              : <div className="rst-imggrid">
                  {images.map((img) => (
                    <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                      <img src={img.url} alt={img.original_name} />
                    </a>
                  ))}
                </div>
          )}

          {tab === "timeline" && (
            <div style={{ maxWidth: 560 }}>
              {buildTimeline(req, offers).map((step, i, arr) => (
                <div key={i} className="rst-timeline__row" style={{ paddingBottom: i === arr.length - 1 ? 0 : 22 }}>
                  <div className="rst-timeline__mark">
                    <div className={`rst-timeline__dot rst-timeline__dot--${step.state}`}>
                      {step.state === "done" ? <Icon name="check" size={12} /> : null}
                    </div>
                    {i < arr.length - 1 ? <div className={`rst-timeline__line${step.state === "done" ? " rst-timeline__line--done" : ""}`} /> : null}
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <div className={`rst-timeline__title${step.state === "todo" ? " rst-timeline__title--todo" : ""}`}>{step.title}</div>
                    <div className="rst-timeline__date">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "offers" && (
            offers.length === 0 ? (
              <Card variant="outline">
                <div className="rst-empty"><p>Noch kein Angebot erhalten. Wir melden uns innerhalb von zwei Werktagen bei Ihnen.</p></div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
                {offers.map((offer) => (
                  <Card key={offer.id} variant={offer.status === "pending" ? "elevated" : "outline"}>
                    <div className="rst-between" style={{ alignItems: "flex-start" }}>
                      <div>
                        <span className="rst-offer__price">{offer.price.toFixed(2)} </span>
                        <span className="rst-offer__cur">{offer.currency}</span>
                        {offer.estimated_days ? (
                          <div className="rst-muted" style={{ fontSize: 13, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            <Icon name="clock" size={14} /> Geschätzte Dauer: {offer.estimated_days} Tage
                          </div>
                        ) : null}
                      </div>
                      <StatusBadge status={offer.status} />
                    </div>
                    {offer.description && <p className="rst-prose rst-mt-4" style={{ margin: "16px 0 0" }}>{offer.description}</p>}
                    {offer.status === "pending" && (
                      <div className="rst-flex rst-gap-3" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                        <Button disabled={responding} startIcon={<Icon name="check" size={15} />} onClick={() => respond(offer.id, "accept")}>Angebot annehmen</Button>
                        <Button disabled={responding} variant="outline" onClick={() => respond(offer.id, "decline")}>Ablehnen</Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}
