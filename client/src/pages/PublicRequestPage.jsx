import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";
import ImageUploader from "../components/ImageUploader";
import { Button, Card, Input, Textarea, Select, Eyebrow, Stepper, Icon } from "../ds";
import { ART_TYPES } from "../lib/artTypes";
import { uploadImages } from "../lib/upload";

const STEPS = ["Details", "Fotos", "Konto & Kontakt"];

export default function PublicRequestPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artType, setArtType] = useState("");
  const [files, setFiles] = useState([]);
  const [acct, setAcct] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => setAcct((a) => ({ ...a, [key]: e.target.value }));

  const next = () => {
    setError("");
    if (step === 0 && !title.trim()) return setError("Bitte geben Sie einen Titel ein.");
    if (step === 1 && files.length === 0) return setError("Bitte laden Sie mindestens ein Bild hoch.");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    setError(""); setEmailTaken(false);
    if (!acct.name.trim() || !acct.email.trim() || !acct.password) {
      return setError("Bitte füllen Sie Name, E-Mail und Passwort aus.");
    }
    if (acct.password.length < 6) return setError("Das Passwort muss mindestens 6 Zeichen lang sein.");

    setSubmitting(true);
    try {
      const images = await uploadImages(files);
      const data = await api.post("/api/requests/guest", {
        title: title.trim(),
        description: description.trim(),
        art_type: artType,
        name: acct.name.trim(),
        email: acct.email.trim(),
        phone: acct.phone.trim(),
        password: acct.password,
        images,
      });
      setSession(data.user, data.token);
      navigate(`/requests/${data.id}`);
    } catch (err) {
      setError(err.message || "Das Absenden ist fehlgeschlagen.");
      if (/registriert/i.test(err.message || "")) setEmailTaken(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="rst-site">
      {/* Minimal public header */}
      <header className="rst-header rst-header--scrolled">
        <div className="rst-header__bar">
          <Link to="/" className="rst-wordmark" style={{ fontSize: 26 }}>Westermeier<span className="dot">.</span></Link>
          <div className="rst-header__actions">
            <Link to="/login" className="rst-header__signin">Bereits Kunde? Anmelden</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
        <Eyebrow rule>Angebot anfordern</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "16px 0 8px", color: "var(--ink-900)" }}>
          Erzählen Sie uns von Ihrem Werk
        </h1>
        <p className="rst-prose" style={{ maxWidth: "52ch", margin: "0 0 28px" }}>
          Laden Sie Fotos hoch und beschreiben Sie das Objekt. Ihr Konto wird dabei automatisch erstellt — danach
          verfolgen Sie Ihr Angebot jederzeit im Portal.
        </p>

        <div style={{ marginBottom: 28 }}><Stepper steps={STEPS} current={step} /></div>

        <Card variant="outline" padding="lg">
          {error && (
            <div className="rst-alert rst-alert--error rst-mb-6">
              {error}
              {emailTaken && (<> <Link to="/login" style={{ fontWeight: 600 }}>Zur Anmeldung →</Link></>)}
            </div>
          )}

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
                Fotografieren Sie das Werk aus mehreren Winkeln — Gesamtansicht, Details und sichtbare Schäden.
              </p>
              <ImageUploader files={files} setFiles={setFiles} />
            </div>
          )}

          {step === 2 && (
            <div className="rst-form-stack">
              <p className="rst-muted" style={{ fontSize: 13, margin: 0, fontFamily: "var(--font-grotesque)" }}>
                Mit diesen Angaben erstellen wir Ihr Konto. So können Sie Ihr Angebot einsehen und den Fortschritt verfolgen.
              </p>
              <Input label="Name" required value={acct.name} onChange={setField("name")} placeholder="Max Mustermann" />
              <Input label="E-Mail" type="email" required value={acct.email} onChange={setField("email")} placeholder="ihre@email.de" />
              <Input label="Telefon" hint="Optional" type="tel" value={acct.phone} onChange={setField("phone")} placeholder="+49 123 456789" />
              <Input label="Passwort wählen" type="password" required minLength={6} value={acct.password}
                onChange={setField("password")} placeholder="Mindestens 6 Zeichen" />
            </div>
          )}

          <div className="rst-between" style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            {step > 0
              ? <Button variant="ghost" onClick={back} startIcon={<Icon name="chevron-left" size={16} />}>Zurück</Button>
              : <Link to="/" className="rst-btn rst-btn--ghost rst-btn--md">Abbrechen</Link>}
            {step < STEPS.length - 1
              ? <Button onClick={next} endIcon={<Icon name="arrow-right" size={16} />}>Weiter</Button>
              : <Button onClick={submit} disabled={submitting} startIcon={<Icon name="check" size={16} />}>
                  {submitting ? "Wird gesendet…" : "Anfrage senden & Konto erstellen"}
                </Button>}
          </div>
        </Card>

        <p className="rst-muted" style={{ fontSize: 12.5, textAlign: "center", marginTop: 20, fontFamily: "var(--font-grotesque)" }}>
          Unverbindlich · Antwort innerhalb von 48 Stunden
        </p>
      </div>
    </div>
  );
}
