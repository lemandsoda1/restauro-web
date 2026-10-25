import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/site.css";

/* ============================================================================
 * Gemeinsamer Rahmen der Webseite: Header, Footer und kleine Bausteine.
 * Wird von der Startseite und von Werkstätte/Team/Referenzen/Impressum genutzt.
 * Kontaktdaten und Footer-Satz hier direkt pflegen.
 * ==========================================================================*/
const CONTACT = { email: "hallo@westermeier-restaurierung.de", phone: "+49 89 000 0000", address: "Kunststraße 18, München" };

const FOOTER_CTA = {
  statement: "Ein Objekt, das Pflege braucht? *Schicken Sie uns ein paar Fotos.*",
  line: { label: "Fotos hochladen & Angebot erhalten", to: "/anfrage" },
};

export const NAV = [["Leistungen", "/#leistungen"], ["Werkstätte", "/werkstatt"], ["Referenzen", "/referenzen"], ["Team", "/team"]];

/* "*…*" im Text → Serif-Kursive */
export function Rich({ text }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part
  );
}

/* Seiten-Links mit react-router, Anker (#…) und mailto: als normale <a> */
export function NavLink({ href, children, ...rest }) {
  return href.includes("#") || href.startsWith("mailto:")
    ? <a href={href} {...rest}>{children}</a>
    : <Link to={href} {...rest}>{children}</Link>;
}

export function Button({ to, href, label, light = false }) {
  const cls = `tpl-btn${light ? " tpl-btn--light" : ""}`;
  return to ? <Link to={to} className={cls}>{label}</Link> : <a href={href} className={cls}>{label}</a>;
}

/* overHero: transparent über dem Hero-Bild, nach dem Scrollen hell. Ohne overHero
   (Unterseiten) ist der Header von Anfang an hell. */
export function SiteHeader({ overHero = false }) {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!overHero) return undefined;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);
  const solid = !overHero || scrolled || open;
  return (
    <header className={`tpl-scope tpl-header${solid ? " tpl-header--solid" : ""}${open ? " tpl-header--open" : ""}`}>
      <Link to="/" className="tpl-header__mark">Westermeier Restaurierung</Link>
      <div className="tpl-header__right">
        <nav className="tpl-header__nav">
          {NAV.map(([l, href]) => <NavLink key={l} href={href} onClick={() => setOpen(false)}>{l}</NavLink>)}
        </nav>
        <div className="tpl-header__actions">
          {user ? (
            <Button to={isAdmin ? "/admin" : "/dashboard"} label="Zum Portal" light={!solid} />
          ) : (
            <>
              <Link to="/login" className="tpl-header__login">Anmelden</Link>
              <Button to="/anfrage" label="Angebot" light={!solid} />
            </>
          )}
          <button className="tpl-header__menu" onClick={() => setOpen((o) => !o)}>{open ? "Schließen" : "Menü"}</button>
        </div>
      </div>
    </header>
  );
}

/* Header für Unterseiten: hell + Platzhalter, weil der Header fixiert ist */
export function SubHeader() {
  return (
    <>
      <SiteHeader />
      <div className="tpl-header-spacer" aria-hidden="true" />
    </>
  );
}

export function SiteFooter() {
  const c = CONTACT;
  return (
    <footer className="tpl-scope tpl-footer tpl-grid">
      <div className="tpl-col-2-end tpl-footer__cta">
        <p><Rich text={FOOTER_CTA.statement} /></p>
        <Link to={FOOTER_CTA.line.to} className="tpl-footer__line"><span>{FOOTER_CTA.line.label}</span><span aria-hidden="true">→</span></Link>
      </div>
      <div className="tpl-col-all tpl-footer__cols">
        <div>
          <h4>Atelier</h4>
          <ul>{NAV.map(([l, href]) => <li key={l}><NavLink href={href}>{l}</NavLink></li>)}</ul>
        </div>
        <div>
          <h4>Kontakt</h4>
          <ul>
            <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
            <li>{c.phone}</li>
            <li>{c.address}</li>
          </ul>
        </div>
        <div>
          <h4>Service</h4>
          <ul>
            <li><Link to="/anfrage">Anfrage stellen</Link></li>
            <li><Link to="/login">Kundenportal</Link></li>
          </ul>
        </div>
        <div>
          <h4>Rechtliches</h4>
          <ul><li><Link to="/impressum">Impressum & Datenschutz</Link></li></ul>
        </div>
      </div>
      <div className="tpl-col-all tpl-footer__bar">
        <span>© {new Date().getFullYear()} Westermeier Restaurierung</span>
        <span>Porzellan · Keramik · Skulptur · Kunsthandwerk</span>
      </div>
    </footer>
  );
}
