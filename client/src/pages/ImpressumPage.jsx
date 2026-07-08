import { Link } from "react-router-dom";
import { useSiteContent } from "../lib/content";

export default function ImpressumPage() {
  const { content } = useSiteContent();
  const c = content.contact || {};
  return (
    <div className="rst-site">
      <header className="rst-header rst-header--scrolled">
        <div className="rst-header__bar">
          <Link to="/" className="rst-hero-wordmark">Westermeier<br />Restaurierung</Link>
          <div className="rst-header__actions">
            <Link to="/" className="rst-header__signin">Zurück zur Startseite</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 600, color: "var(--ink-900)", margin: "0 0 24px" }}>
          Impressum
        </h1>

        {content.imprint ? (
          <p className="rst-prose" style={{ whiteSpace: "pre-wrap", fontSize: 16 }}>{content.imprint}</p>
        ) : (
          <div className="rst-prose" style={{ fontSize: 16 }}>
            <p>Westermeier Restaurierung — Atelier für Kunstrestaurierung und Konservierung.</p>
            <p style={{ marginTop: 16 }}>
              {c.address ? <>{c.address}<br /></> : null}
              {c.phone ? <>Telefon: {c.phone}<br /></> : null}
              {c.email ? <>E‑Mail: {c.email}</> : null}
            </p>
            <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>
              Die vollständigen Impressums‑ und Datenschutzangaben werden im Atelier‑Verwaltungsbereich gepflegt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
