import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button, ButtonLink, Eyebrow, WorkCard, Badge, Plate, Icon } from "../ds";

/* ---- Overlay header: transparent white over the hero, solid on scroll ---- */
function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["Services", "#leistungen"], ["Referenzen", "#atelier"], ["Werkstätte", "#ablauf"]];
  const ctaVariant = scrolled ? "primary" : "hero";
  return (
    <header className={`rst-header rst-header--overlay ${scrolled ? "rst-header--scrolled" : "rst-header--hero"}`}>
      <div className="rst-header__bar">
        <Link to="/" className="rst-hero-wordmark">Westermeier<br />Restaurierung</Link>
        <nav className="rst-header__nav">
          {links.map(([l, href]) => <a key={l} href={href}>{l}</a>)}
        </nav>
        <div className="rst-header__actions">
          {user ? (
            <ButtonLink as={Link} to={isAdmin ? "/admin" : "/dashboard"} size="sm" variant={ctaVariant}>Zum Portal</ButtonLink>
          ) : (
            <>
              <Link to="/login" className="rst-header__signin">Anmelden</Link>
              <ButtonLink as={Link} to="/anfrage" size="sm" variant={ctaVariant}>Angebot erhalten</ButtonLink>
            </>
          )}
          <button className="rst-header__menu rst-iconbtn rst-iconbtn--md" aria-label="Menü" onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "8px 24px 16px" }}>
          {links.map(([l, href]) => (
            <a key={l} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", fontFamily: "var(--font-grotesque)", fontWeight: 500, color: "var(--stone-700)" }}>{l}</a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <ButtonLink as={Link} to="/login" variant="outline" size="sm" block>Anmelden</ButtonLink>
            <ButtonLink as={Link} to="/anfrage" size="sm" block>Angebot erhalten</ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <>
      <section className="rst-hero-full">
        <div className="rst-hero-full__scrim" />
        <div className="rst-hero-full__inner">
          <h1 className="rst-hero-full__title">
            Kunst&shy;restaurierung und Konservierung <em>seit 1989</em>
          </h1>
          <p className="rst-hero-full__lede">
            Ein Atelier für Gemälde, Fresken, Papierarbeiten und Objekte — wissenschaftliche
            Sorgfalt und die geduldige Hand des Restaurators.
          </p>
          <div className="rst-hero-full__cta">
            <ButtonLink as={Link} to="/anfrage" size="lg" variant="accent" endIcon={<Icon name="arrow-right" size={16} />}>
              Fotos hochladen & Angebot erhalten
            </ButtonLink>
            <ButtonLink as="a" href="#ablauf" size="lg" variant="hero">So funktioniert es</ButtonLink>
          </div>
        </div>
      </section>
      <section className="rst-statsbar">
        <div className="rst-statsbar__inner">
          {[["1.400+", "Restaurierte Werke"], ["35 Jahre", "Erfahrung"], ["48 Std.", "Bis zum Angebot"]].map(([n, l]) => (
            <div key={l}>
              <div className="rst-statsbar__n">{n}</div>
              <div className="rst-statsbar__l">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Services() {
  const items = [
    ["scan-line", "Begutachtung & Bildgebung", "Technische Untersuchung — UV-, Infrarot- und Streiflicht — zur Kartierung des Zustands und als Grundlage jeder Behandlung."],
    ["brush", "Reinigung & Restaurierung", "Oberflächenreinigung, strukturelle Reparatur, Retusche und Neufirnis durch Fachrestauratoren."],
    ["frame", "Rahmung & Montierung", "Konservatorische Rahmung, Verglasung und archivfeste Montierungen, individuell auf jedes Werk abgestimmt."],
    ["shield-check", "Präventive Konservierung", "Klimauntersuchungen, Pflegekonzepte für Sammlungen und Zustandskontrolle über die Zeit."],
  ];
  return (
    <section id="leistungen" className="rst-section--surface">
      <div className="rst-section">
        <div className="rst-sec-head">
          <div>
            <Eyebrow>Was wir tun</Eyebrow>
            <h2 className="rst-sec-title">Leistungen</h2>
          </div>
        </div>
        <div className="rst-services">
          {items.map(([ic, t, d]) => (
            <div key={t} className="rst-service">
              <div className="rst-service__icon"><Icon name={ic} size={22} /></div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Fotos hochladen", "Fotografieren Sie Ihr Werk aus mehreren Winkeln — Schäden, Details und Gesamtzustand.", "JPG, PNG oder WebP · bis zu 10 Bilder"],
    ["02", "Angebot erhalten", "Unsere Restauratoren beurteilen den Zustand und erstellen ein detailliertes, unverbindliches Angebot.", "Innerhalb von 48 Stunden"],
    ["03", "Fortschritt verfolgen", "Geben Sie das Angebot frei und verfolgen Sie den Weg Ihres Werks bis zur Fertigstellung im Portal.", "Transparenter Status in Echtzeit"],
  ];
  return (
    <section id="ablauf" className="rst-section">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Eyebrow>In drei Schritten</Eyebrow>
        <h2 className="rst-sec-title" style={{ marginLeft: "auto", marginRight: "auto" }}>So funktioniert es</h2>
      </div>
      <div className="rst-services">
        {steps.map(([n, t, d, meta]) => (
          <div key={n} className="rst-service" style={{ gridColumn: "span 1" }}>
            <div className="rst-service__icon" style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600 }}>{n}</div>
            <h3>{t}</h3>
            <p>{d}</p>
            <span className="r-mono" style={{ fontSize: 11, letterSpacing: ".06em", color: "var(--text-muted)" }}>{meta}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <ButtonLink as={Link} to="/anfrage" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>Jetzt Angebot anfordern</ButtonLink>
      </div>
    </section>
  );
}

function Featured() {
  const works = [
    { refId: "RST-2026-0148", title: "Marine bei Dämmerung", artist: "Umkreis C.-J. Vernet", meta: "Öl auf Leinwand · um 1774", tone: 1, status: <Badge tone="success" dot>In Bearbeitung</Badge> },
    { refId: "RST-2026-0132", title: "Handstudie", artist: "zugeschr. G. Reni", meta: "Rötel auf Papier", tone: 0, status: <Badge tone="warning" dot>In Prüfung</Badge> },
    { refId: "RST-2026-0119", title: "Vergoldeter Konsolentisch", artist: "Louis-XV-Zeit", meta: "Geschnitztes Goldholz", tone: 2, status: <Badge tone="brand">Abgeschlossen</Badge> },
    { refId: "RST-2026-0104", title: "Bildnis einer Dame", artist: "Niederländische Schule", meta: "Öl auf Holz · um 1620", tone: 3, status: <Badge tone="brand">Abgeschlossen</Badge> },
  ];
  return (
    <section id="atelier" className="rst-section">
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <Eyebrow>Aus dem Atelier</Eyebrow>
        <h2 className="rst-sec-title" style={{ marginLeft: "auto", marginRight: "auto" }}>Aktuelle Behandlungen</h2>
      </div>
      <div className="rst-works-grid">
        {works.map((w) => (
          <WorkCard key={w.refId} refId={w.refId} title={w.title} artist={w.artist} meta={w.meta} status={w.status}
            image={<Plate ratio="4/5" tone={w.tone} />} />
        ))}
      </div>
    </section>
  );
}

function ClosingCTA() {
  const faqs = [
    { q: "Wie lange dauert eine Behandlung?", a: "Die meisten Behandlungen dauern je nach Umfang und Zustand 4–12 Wochen." },
    { q: "Holen Sie das Werk ab?", a: "Ja — versicherte Abholung und Rücklieferung sind innerhalb der Region inbegriffen." },
    { q: "Erhalte ich eine Dokumentation?", a: "Jedes Projekt schließt mit einem vollständigen fotografischen Zustands- und Behandlungsbericht ab." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="kontakt" className="rst-cta">
      <div className="rst-cta__inner">
        <div>
          <Eyebrow tone="onDark">Beginnen</Eyebrow>
          <h2>Ein Werk, das Pflege braucht?</h2>
          <p>Teilen Sie uns einige Details und Fotografien mit. Ein Restaurator meldet sich innerhalb von zwei Werktagen.</p>
          <ButtonLink as={Link} to="/anfrage" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>Beratung anfragen</ButtonLink>
        </div>
        <div className="rst-faq">
          {faqs.map((it, i) => (
            <div key={i} className="rst-faq__item">
              <button className="rst-faq__q" onClick={() => setOpen(open === i ? -1 : i)}>
                {it.q}<Icon name={open === i ? "minus" : "plus"} size={18} />
              </button>
              {open === i ? <p className="rst-faq__a">{it.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols = [
    ["Atelier", ["Leistungen", "Das Team", "Journal", "Karriere"]],
    ["Sammler", ["Beratung anfragen", "Kundenportal", "Versicherung", "Versand"]],
    ["Kontakt", ["hallo@westermeier-restaurierung.de", "+49 89 000 0000", "Kunststraße 18, München"]],
  ];
  return (
    <footer className="rst-footer">
      <div className="rst-footer__grid">
        <div>
          <div className="rst-wordmark" style={{ fontSize: 26 }}>Westermeier<span className="dot">.</span></div>
          <p className="rst-footer__lede">Ein Atelier für die Restaurierung von Gemälden, Papier und Objekten.</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h}>
            <div className="rst-footer__col-h">{h}</div>
            <div className="rst-footer__links">
              {links.map((l) => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="rst-footer__bar">
        <span>© 2026 Westermeier Restaurierung</span>
        <span>Datenschutz · Impressum</span>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="rst-site">
      <SiteHeader />
      <Hero />
      <Services />
      <HowItWorks />
      <Featured />
      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
