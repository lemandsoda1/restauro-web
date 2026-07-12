import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Layout from "../../components/Layout";
import ImageUploader from "../../components/ImageUploader";
import { Button, Card, Input, Textarea, Select, Eyebrow, Stepper, Icon } from "../../ds";
import { ART_TYPES, artTypeLabel } from "../../lib/artTypes";
import { uploadImages } from "../../lib/upload";

const STEPS = ["Details", "Fotos", "Prüfen & senden"];

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artType, setArtType] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const next = () => {
    setError("");
    if (step === 0 && !title.trim()) return setError("Bitte geben Sie einen Titel ein.");
    if (step === 1 && files.length === 0) return setError("Bitte laden Sie mindestens ein Bild hoch.");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const images = await uploadImages(files);
      const data = await api.post("/api/requests", {
        title: title.trim(),
        description: description.trim(),
        art_type: artType,
        images,
      });
      navigate(`/requests/${data.id}`);
    } catch (err) {
      setError(err.message || "Das Absenden ist fehlgeschlagen.");
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Neue Anfrage">
      <div className="rst-form-narrow">
        <Eyebrow>Restaurierungsanfrage</Eyebrow>
        <h1 className="rst-page-title" style={{ marginBottom: 24 }}>Erzählen Sie uns von Ihrem Objekt</h1>

        <div style={{ marginBottom: 28 }}><Stepper steps={STEPS} current={step} /></div>

        <Card variant="outline" padding="lg">
          {error && <div className="rst-alert rst-alert--error rst-mb-6">{error}</div>}

          {step === 0 && (
            <div className="rst-form-stack">
              <Input label="Titel / Bezeichnung" required value={title}
                onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Ölgemälde, 19. Jahrhundert" />
              <Select label="Art des Objekts" value={artType} onChange={(e) => setArtType(e.target.value)}
                placeholder="Bitte auswählen…" options={ART_TYPES} />
              <Textarea label="Beschreibung / Zustand" rows={5} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreiben Sie den aktuellen Zustand, sichtbare Schäden, Maße, bekannte Geschichte…" />
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ fontFamily: "var(--font-grotesque)", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                Fotos hochladen <span style={{ color: "var(--royal-600)" }}>*</span>
              </div>
              <p className="rst-muted" style={{ fontSize: 13, margin: "0 0 14px", fontFamily: "var(--font-grotesque)" }}>
                Fotografieren Sie das Objekt aus mehreren Winkeln — Gesamtansicht, Details und sichtbare Schäden.
              </p>
              <ImageUploader files={files} setFiles={setFiles} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, margin: "0 0 16px" }}>Zusammenfassung</h3>
              <div className="rst-review__row"><span className="rst-review__k">Titel</span><span className="rst-review__v">{title || "—"}</span></div>
              <div className="rst-review__row"><span className="rst-review__k">Objektart</span><span className="rst-review__v">{artTypeLabel(artType) || "—"}</span></div>
              <div className="rst-review__row"><span className="rst-review__k">Beschreibung</span><span className="rst-review__v" style={{ maxWidth: "60%" }}>{description || "—"}</span></div>
              <div className="rst-review__row"><span className="rst-review__k">Fotos</span><span className="rst-review__v">{files.length} Bild{files.length !== 1 ? "er" : ""}</span></div>
              {files.length > 0 && (
                <div className="rst-thumbs" style={{ marginTop: 18 }}>
                  {files.slice(0, 4).map((f, i) => (
                    <div key={i} className="rst-thumb"><img src={URL.createObjectURL(f)} alt={f.name} /></div>
                  ))}
                </div>
              )}
              <p className="rst-muted" style={{ fontSize: 13, marginTop: 18, fontFamily: "var(--font-grotesque)" }}>
                Nach dem Absenden prüft ein Restaurator Ihre Angaben und erstellt innerhalb von 48 Stunden ein unverbindliches Angebot.
              </p>
            </div>
          )}

          {/* Wizard controls */}
          <div className="rst-between" style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            {step > 0
              ? <Button variant="ghost" onClick={back} startIcon={<Icon name="chevron-left" size={16} />}>Zurück</Button>
              : <Link to="/dashboard" className="rst-btn rst-btn--ghost rst-btn--md">Abbrechen</Link>}
            {step < STEPS.length - 1
              ? <Button onClick={next} endIcon={<Icon name="arrow-right" size={16} />}>Weiter</Button>
              : <Button onClick={submit} disabled={submitting} startIcon={<Icon name="check" size={16} />}>
                  {submitting ? "Wird gesendet…" : "Anfrage absenden"}
                </Button>}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
