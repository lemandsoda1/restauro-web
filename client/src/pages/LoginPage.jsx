import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button, Input, Eyebrow } from "../ds";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
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
          <h2>Die stille Kunst,<br /><em>Werke zurückzubringen</em></h2>
          <p>Melden Sie sich an, um Ihre Anfragen, Angebote und den Behandlungsfortschritt einzusehen.</p>
        </div>
        <div className="r-mono" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(247,242,232,.5)", position: "relative" }}>
          KUNSTRESTAURIERUNG · KONSERVIERUNG
        </div>
      </aside>

      <main className="rst-auth__main">
        <div className="rst-auth__card">
          <div className="rst-auth__head">
            <Eyebrow>Willkommen zurück</Eyebrow>
            <h1>Anmelden</h1>
          </div>
          <form className="rst-auth__form" onSubmit={handleSubmit}>
            {error && <div className="rst-alert rst-alert--error">{error}</div>}
            <Input label="E-Mail" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="ihre@email.de" />
            <Input label="Passwort" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" block size="lg" disabled={loading}>
              {loading ? "Anmeldung…" : "Anmelden"}
            </Button>
          </form>
          <p className="rst-auth__foot">
            Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
