import { Link } from "react-router-dom";

/* Shared marketing footer. Contact details are pflegbar hier im Code. */
const CONTACT = {
  email: "hallo@westermeier-restaurierung.de",
  phone: "+49 89 000 0000",
  address: "Kunststraße 18, München",
};

export default function SiteFooter() {
  const c = CONTACT;
  return (
    <footer className="rst-footer">
      <div className="rst-footer__grid">
        <div>
          <div className="rst-hero-wordmark">Westermeier<br />Restaurierung</div>
          <p className="rst-footer__lede">Werkstätte für Kunstrestaurierung und Konservierung — Gemälde, Fresken, Papierarbeiten und Objekte.</p>
        </div>
        <div>
          <div className="rst-footer__col-h">Atelier</div>
          <div className="rst-footer__links">
            <a href="/#leistungen">Leistungen</a>
            <Link to="/team">Das Team</Link>
            <a href="/#ablauf">Ablauf</a>
            <a href="/#atelier">Referenzen</a>
          </div>
        </div>
        <div>
          <div className="rst-footer__col-h">Sammler</div>
          <div className="rst-footer__links">
            <Link to="/anfrage">Beratung anfragen</Link>
            <Link to="/login">Kundenportal</Link>
          </div>
        </div>
        <div>
          <div className="rst-footer__col-h">Kontakt</div>
          <div className="rst-footer__links">
            {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : null}
            {c.phone ? <a href={`tel:${c.phone.replace(/\s+/g, "")}`}>{c.phone}</a> : null}
            {c.address ? <span style={{ color: "var(--stone-700)", fontSize: 14 }}>{c.address}</span> : null}
          </div>
        </div>
      </div>
      <div className="rst-footer__bar">
        <span>© {new Date().getFullYear()} Westermeier Restaurierung</span>
        <span><Link to="/impressum">Datenschutz · Impressum</Link></span>
      </div>
    </footer>
  );
}
