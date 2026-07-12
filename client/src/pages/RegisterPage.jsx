import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button, Input, Eyebrow } from "../ds";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.phone);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rst-auth">
      <aside className="rst-auth__aside">
        <div className="rst-auth__aside-plate" />
        <Link to="/" className="rst-hero-wordmark" style={{ color: "var(--paper-000)", position: "relative" }}>
          Westermeier<br />Restaurierung
        </Link>
        <div>
          <h2>Teilen Sie ein Objekt, das <em>Pflege braucht</em></h2>
          <p>Erstellen Sie ein Konto, laden Sie Fotos hoch und erhalten Sie innerhalb von 48 Stunden ein unverbindliches Angebot.</p>
        </div>
        <div className="r-mono" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(247,242,232,.5)", position: "relative" }}>
          KUNSTRESTAURIERUNG · KONSERVIERUNG
        </div>
      </aside>

      <main className="rst-auth__main">
        <div className="rst-auth__card">
          <div className="rst-auth__head">
            <Eyebrow>Erste Schritte</Eyebrow>
            <h1>Konto erstellen</h1>
          </div>
          <form className="rst-auth__form" onSubmit={handleSubmit}>
            {error && <div className="rst-alert rst-alert--error">{error}</div>}
            <Input label="Name" required value={form.name} onChange={set("name")} placeholder="Max Mustermann" />
            <Input label="E-Mail" type="email" required value={form.email} onChange={set("email")} placeholder="ihre@email.de" />
            <Input label="Telefon" hint="Optional" type="tel" value={form.phone} onChange={set("phone")} placeholder="+49 123 456789" />
            <Input label="Passwort" type="password" required minLength={6} value={form.password}
              onChange={set("password")} placeholder="Mindestens 6 Zeichen" />
            <Button type="submit" block size="lg" disabled={loading}>
              {loading ? "Wird erstellt…" : "Konto erstellen"}
            </Button>
          </form>
          <p className="rst-auth__foot">
            Bereits registriert? <Link to="/login">Anmelden</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
