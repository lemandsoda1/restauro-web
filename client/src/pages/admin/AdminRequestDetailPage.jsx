import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import Layout from "../../components/Layout";
import { Button, Card, Input, Textarea, Stepper, Icon } from "../../ds";
import { StatusBadge, STATUS_LABELS, refId } from "../../ds/status";
import { artTypeLabel, formatDate } from "../../lib/artTypes";

const WORKFLOW = ["Sichtung", "Zustand", "Angebot"];
const LIFECYCLE = [
  ["new", "Eingang"], ["quoted", "Angebot"], ["accepted", "Freigabe"],
  ["in_progress", "Arbeit"], ["completed", "Fertig"],
];

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [assessment, setAssessment] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [offerDesc, setOfferDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [offerError, setOfferError] = useState("");

  const load = () => {
    api.get(`/api/admin/requests/${id}`).then(setData).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);

  const goToQuote = () => {
    if (!offerDesc && assessment) setOfferDesc(assessment);
    setStep(2);
  };

  const createOffer = async () => {
    setOfferError("");
    if (!price || parseFloat(price) <= 0) return setOfferError("Bitte geben Sie einen gültigen Preis ein.");
    setSubmitting(true);
    try {
      await api.post(`/api/admin/requests/${id}/offers`, {
        price: parseFloat(price),
        description: offerDesc.trim() || null,
        estimated_days: estimatedDays ? parseInt(estimatedDays) : null,
      });
      setPrice(""); setOfferDesc(""); setEstimatedDays(""); setAssessment(""); setStep(0);
      load();
    } catch (err) { setOfferError(err.message); } finally { setSubmitting(false); }
  };

  const updateStatus = async (status) => {
    try { await api.patch(`/api/admin/requests/${id}/status`, { status }); load(); } catch { /* ignore */ }
  };

  if (loading) return <Layout title="Anfrage"><div className="rst-center-load">Laden…</div></Layout>;
  if (!data) return <Layout title="Anfrage"><div className="rst-center-load">Anfrage nicht gefunden.</div></Layout>;

  const { request: req, images, offers } = data;
  const lifecycleIdx = Math.max(0, LIFECYCLE.findIndex(([s]) => s === req.status));
  const crumbs = [{ label: "Dashboard", onClick: () => navigate("/admin") }, { label: req.title }];

  return (
    <Layout crumbs={crumbs}>
      {/* Header */}
      <div className="rst-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <div className="rst-detail-hero__ref">{refId(req)}</div>
          <h1 className="rst-detail-hero__title" style={{ marginBottom: 8 }}>{req.title}</h1>
          <div className="rst-muted" style={{ fontSize: 13.5, fontFamily: "var(--font-grotesque)", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="user" size={14} />{req.client_name}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="mail" size={14} />{req.client_email}</span>
            {req.client_phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="phone" size={14} />{req.client_phone}</span>}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Lifecycle stepper (read-only) */}
      <Card variant="outline" padding="sm">
        <div style={{ overflowX: "auto" }}>
          <Stepper steps={LIFECYCLE.map(([, l]) => l)} current={req.status === "declined" ? 0 : lifecycleIdx} />
        </div>
      </Card>

      <div className="rst-two-col rst-mt-6" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Main: guided quote workflow */}
        <div>
          <Card variant="outline" padding="lg">
            <div style={{ marginBottom: 24 }}>
              <div className="rst-detail-meta__label" style={{ marginBottom: 12 }}>Angebotsprozess</div>
              <Stepper steps={WORKFLOW} current={step} />
            </div>

            {step === 0 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>Sichtung</h3>
                <p className="rst-prose" style={{ margin: "0 0 18px" }}>
                  {req.description || "Der Kunde hat keine Beschreibung hinterlegt."}
                </p>
                {images.length > 0 ? (
                  <div className="rst-imggrid">
                    {images.map((img) => (
                      <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                        <img src={img.url} alt={img.original_name} />
                      </a>
                    ))}
                  </div>
                ) : <p className="rst-muted">Keine Fotos hochgeladen.</p>}
                <div className="rst-flex" style={{ justifyContent: "flex-end", marginTop: 24 }}>
                  <Button onClick={() => setStep(1)} endIcon={<Icon name="arrow-right" size={16} />}>Zustand beurteilen</Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>Zustandsbeurteilung</h3>
                <Textarea label="Notizen zum Zustand & geplante Maßnahmen" rows={6} value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  placeholder="z. B. Oberflächenschmutz und vergilbter Firnis, feine Craquelé im Himmel. Vorgeschlagen: schonende Reinigung, Firnisabnahme, Konsolidierung, Neufirnis." />
                <p className="rst-muted" style={{ fontSize: 12.5, marginTop: 8, fontFamily: "var(--font-grotesque)" }}>
                  Diese Notiz wird als Vorlage in die Angebotsbeschreibung übernommen.
                </p>
                <div className="rst-between" style={{ marginTop: 24 }}>
                  <Button variant="ghost" onClick={() => setStep(0)} startIcon={<Icon name="chevron-left" size={16} />}>Zurück</Button>
                  <Button onClick={goToQuote} endIcon={<Icon name="arrow-right" size={16} />}>Zum Angebot</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, margin: "0 0 16px" }}>Angebot erstellen</h3>
                {offerError && <div className="rst-alert rst-alert--error rst-mb-4">{offerError}</div>}
                <div className="rst-form-stack">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Input label="Preis (EUR)" required type="number" step="0.01" min="0" value={price}
                      onChange={(e) => setPrice(e.target.value)} placeholder="z. B. 850.00" />
                    <Input label="Geschätzte Dauer (Tage)" type="number" min="1" value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)} placeholder="z. B. 14" />
                  </div>
                  <Textarea label="Beschreibung / Leistungsumfang" rows={4} value={offerDesc}
                    onChange={(e) => setOfferDesc(e.target.value)} placeholder="Was ist im Preis enthalten…" />
                </div>
                <div className="rst-between" style={{ marginTop: 24 }}>
                  <Button variant="ghost" onClick={() => setStep(1)} startIcon={<Icon name="chevron-left" size={16} />}>Zurück</Button>
                  <Button onClick={createOffer} disabled={submitting} startIcon={<Icon name="check" size={16} />}>
                    {submitting ? "Wird gesendet…" : "Angebot an Kunden senden"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Existing offers */}
          <div className="rst-mt-6">
            <div className="rst-detail-meta__label" style={{ marginBottom: 12 }}>Bestehende Angebote ({offers.length})</div>
            {offers.length === 0 ? (
              <p className="rst-muted">Noch kein Angebot erstellt.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {offers.map((o) => (
                  <Card key={o.id} variant="outline" padding="sm">
                    <div className="rst-between">
                      <span><span className="rst-offer__price" style={{ fontSize: 24 }}>{o.price.toFixed(2)} </span><span className="rst-offer__cur">{o.currency}</span></span>
                      <StatusBadge status={o.status} />
                    </div>
                    {o.estimated_days ? <div className="rst-muted" style={{ fontSize: 12, marginTop: 4 }}>{o.estimated_days} Tage geschätzt</div> : null}
                    {o.description ? <p className="rst-prose" style={{ fontSize: 14, margin: "10px 0 0" }}>{o.description}</p> : null}
                    <div className="rst-muted" style={{ fontSize: 11, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)" }}>
                      Erstellt {formatDate(o.created_at)}{o.responded_at ? ` · Antwort ${formatDate(o.responded_at)}` : ""}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Aside: facts + status control */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card variant="elevated">
            <div className="rst-detail-meta__label">Objekt</div>
            {[
              ["Objektart", artTypeLabel(req.art_type) || "—"],
              ["Fotos", String(images.length)],
              ["Eingegangen", formatDate(req.created_at)],
              ["Status", STATUS_LABELS[req.status] || req.status],
            ].map(([k, v]) => (
              <div key={k} className="rst-detail-meta__row">
                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card variant="outline">
            <div className="rst-detail-meta__label" style={{ marginBottom: 12 }}>Status ändern</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Button variant={req.status === "in_progress" ? "primary" : "outline"} block
                disabled={req.status === "in_progress"} onClick={() => updateStatus("in_progress")}
                startIcon={<Icon name="brush" size={15} />}>In Bearbeitung</Button>
              <Button variant={req.status === "completed" ? "primary" : "outline"} block
                disabled={req.status === "completed"} onClick={() => updateStatus("completed")}
                startIcon={<Icon name="check-circle" size={15} />}>Abgeschlossen</Button>
              <Button variant="ghost" block onClick={() => updateStatus("declined")}>Ablehnen</Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
