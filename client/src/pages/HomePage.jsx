import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ButtonLink, Eyebrow, WorkCard, Badge, Plate, Icon } from "../ds";

/* ============================================================================
 * SEITENINHALTE — hier direkt im Code pflegen.
 * Texte, Kennzahlen, Leistungen, Ablauf, FAQ, Kontakt und die Referenzen
 * unter „Aktuelle Behandlungen" einfach unten ändern und neu deployen.
 * ==========================================================================*/

const HERO = {
  title: "Werkstätte für Kunstrestaurierung und Konservierung",
  emphasis: "Kunstrestaurierung", // dieses Wort wird kursiv als Akzent gesetzt
  lede: "", // Untertitel unter dem Hero-Titel; leer lassen = kein Text
};

/* Renders the hero headline with one italic accent word (à la "Never Overpay Again"). */
function heroHeadline(text, emph) {
  const i = emph ? text.indexOf(emph) : -1;
  if (i === -1) return text;
  return <>{text.slice(0, i)}<em>{emph}</em>{text.slice(i + emph.length)}</>;
}

// Logo-Carousel unter dem Hero. Jeder Eintrag ist entweder ein Bild
// ({ name, src: "/logos/xyz.svg" }) oder — solange noch kein Bild da ist —
// nur ein { name } (wird als Text-Wortmarke gezeigt). Bilder nach
// client/public/logos/ legen und hier den src ergänzen.
const LOGOS_EYEBROW = ""; // Text über dem Carousel; leer lassen = kein Text
const LOGOS = [
  { name: "Bayerische Schlösserverwaltung", src: "/logos/bayerische-schloesserverwaltung.png" },
  { name: "Erzbistum Berlin", src: "/logos/erzbistum-berlin.png" },
  { name: "Stiftung Fürst Liechtenstein", src: "/logos/stiftung-fuerst-liechtenstein.png" },
  { name: "Bistum Regensburg", src: "/logos/bistum-regensburg.png" },
  { name: "Kunsthistorisches Museum Wien", src: "/logos/kunsthistorisches-museum-wien.png" },
  { name: "Staatliches Bauamt Rosenheim", src: "/logos/staatliches-bauamt-rosenheim.png" },
  { name: "Erzdiözese München und Freising", src: "/logos/erzdioezese-muenchen-freising.png" },
];

const SERVICES = [
  { icon: "scan-line", title: "Begutachtung & Bildgebung", text: "Technische Untersuchung — UV-, Infrarot- und Streiflicht — zur Kartierung des Zustands und als Grundlage jeder Behandlung." },
  { icon: "brush", title: "Reinigung & Restaurierung", text: "Oberflächenreinigung, strukturelle Reparatur, Retusche und Neufirnis durch Fachrestauratoren." },
  { icon: "frame", title: "Rahmung & Montierung", text: "Konservatorische Rahmung, Verglasung und archivfeste Montierungen, individuell auf jedes Werk abgestimmt." },
  { icon: "shield-check", title: "Präventive Konservierung", text: "Klimauntersuchungen, Pflegekonzepte für Sammlungen und Zustandskontrolle über die Zeit." },
];

const FAQ = [
  { q: "Wie lange dauert eine Behandlung?", a: "Die meisten Behandlungen dauern je nach Umfang und Zustand 4–12 Wochen." },
  { q: "Holen Sie das Werk ab?", a: "Ja — versicherte Abholung und Rücklieferung sind innerhalb der Region inbegriffen." },
  { q: "Erhalte ich eine Dokumentation?", a: "Jedes Projekt schließt mit einem vollständigen fotografischen Zustands- und Behandlungsbericht ab." },
];

const CONTACT = {
  email: "hallo@westermeier-restaurierung.de",
  phone: "+49 89 000 0000",
  address: "Kunststraße 18, München",
};

// Referenzen unter „Aktuelle Behandlungen". image ist optional — ohne Bild
// wird eine getönte Platzhalter-Platte gezeigt (tone 0–3).
const WORKS = [
  { title: "Marine bei Dämmerung", artist: "Umkreis C.-J. Vernet", meta: "Öl auf Leinwand · um 1774", statusLabel: "In Bearbeitung", image: null, tone: 1 },
  { title: "Handstudie", artist: "zugeschr. G. Reni", meta: "Rötel auf Papier", statusLabel: "In Prüfung", image: null, tone: 0 },
  { title: "Vergoldeter Konsolentisch", artist: "Louis-XV-Zeit", meta: "Geschnitztes Goldholz", statusLabel: "Abgeschlossen", image: null, tone: 2 },
  { title: "Bildnis einer Dame", artist: "Niederländische Schule", meta: "Öl auf Holz · um 1620", statusLabel: "Abgeschlossen", image: null, tone: 3 },
];

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
          <h1 className="rst-hero-full__title">{heroHeadline(HERO.title, HERO.emphasis)}</h1>
          {HERO.lede ? <p className="rst-hero-full__lede">{HERO.lede}</p> : null}
          <div className="rst-hero-full__cta">
            <ButtonLink as={Link} to="/anfrage" size="lg" variant="accent" endIcon={<Icon name="arrow-right" size={16} />}>
              Fotos hochladen & Angebot erhalten
            </ButtonLink>
            <ButtonLink as="a" href="#ablauf" size="lg" variant="hero">So funktioniert es</ButtonLink>
          </div>
        </div>
      </section>
      <LogoMarquee />
    </>
  );
}

/* Auto-scrolling, seamless logo carousel. The list is rendered twice so the
   CSS marquee can loop without a visible seam; hover pauses it. */
function LogoMarquee() {
  if (!LOGOS.length) return null;
  // Tile the set so one "half" is wide enough to fill the viewport, then
  // render it twice so the -50% CSS loop is seamless regardless of count.
  const reps = Math.max(2, Math.ceil(14 / LOGOS.length));
  const half = Array.from({ length: reps }, () => LOGOS).flat();
  const loop = [...half, ...half];
  return (
    <section className="rst-logos" aria-label="Referenzen und Partner">
      {LOGOS_EYEBROW ? <p className="rst-logos__eyebrow">{LOGOS_EYEBROW}</p> : null}
      <div className="rst-logos__viewport">
        <div className="rst-logos__track">
          {loop.map((logo, i) => (
            <div className="rst-logo" key={i} aria-hidden={i >= LOGOS.length}>
              {logo.src
                ? <img src={logo.src} alt={logo.name} loading="lazy" />
                : <span className="rst-logo__text">{logo.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Unified centered section header: gilt hairline · eyebrow · serif title. */
function SectionHead({ eyebrow, title, lead }) {
  return (
    <div className="rst-sechead">
      <span className="rst-sechead__rule" aria-hidden="true" />
      <span className="rst-sechead__eyebrow">{eyebrow}</span>
      <h2 className="rst-sechead__title">{title}</h2>
      {lead ? <p className="rst-sechead__lead">{lead}</p> : null}
    </div>
  );
}

function Services() {
  return (
    <section id="leistungen" className="rst-section">
      <SectionHead eyebrow="Was wir tun" title="Leistungen" />
      <div className="rst-services">
        {SERVICES.map((s, i) => (
          <div key={i} className="rst-service">
            <div className="rst-service__icon"><Icon name={s.icon || "sparkles"} size={22} /></div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Der komplette Ablauf als Karten-Carousel (dunkle Section). Reihenfolge/Texte
// hier pflegen; Icons müssen im DS-Icon-Set existieren.
const PROCESS = [
  { icon: "upload", title: "Foto hochladen", text: "Laden Sie Fotos Ihres Werks aus mehreren Winkeln hoch — Schäden, Details und Gesamtzustand." },
  { icon: "search", title: "Durchsicht & Bewertung", text: "Unsere Experten prüfen Zustand und Anforderungen des Objekts sorgfältig." },
  { icon: "receipt", title: "Angebot", text: "Sie erhalten ein unverbindliches Angebot für die Restaurierung des Objekts." },
  { icon: "archive", title: "Versand zu uns", text: "Nach Freigabe senden Sie das Objekt versichert an unser Atelier." },
  { icon: "brush", title: "Restaurierung", text: "Wir restaurieren Ihr Werk fachgerecht und gemäß dem vereinbarten Angebot." },
  { icon: "file-text", title: "Dokumentation & Rückversand", text: "Vollständige Foto­dokumentation und sicherer Rückversand an Sie." },
];

/* The whole process as a card carousel: dark section, swipeable step cards,
   prev/next arrows and progress dots. */
function ProcessCarousel() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    const card = track && track.children[i];
    if (!track || !card) return;
    const delta = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const tl = track.getBoundingClientRect().left;
    let best = 0, bestD = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - tl);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
  };

  return (
    <section className="rst-show" id="ablauf" aria-label="Ablauf in sechs Schritten">
      <div className="rst-show__inner">
        <div className="rst-show__head">
          <span className="rst-show__eyebrow">In sechs Schritten</span>
          <h2 className="rst-show__title">Vom Foto zum <em>Angebot</em></h2>
        </div>

        <div className="rst-carousel">
          <div className="rst-carousel__track" ref={trackRef} onScroll={onScroll}>
            {PROCESS.map((p, i) => (
              <article className="rst-proc-card" key={i}>
                <div className="rst-proc-card__icon"><Icon name={p.icon} size={22} /></div>
                <div className="rst-proc-card__step">Schritt {i + 1}</div>
                <h3 className="rst-proc-card__title">{p.title}</h3>
                <p className="rst-proc-card__text">{p.text}</p>
              </article>
            ))}
          </div>

          <div className="rst-carousel__controls">
            <div className="rst-carousel__dots">
              {PROCESS.map((_, i) => (
                <button key={i} className={`rst-dot${i === active ? " rst-dot--active" : ""}`}
                  aria-label={`Zu Schritt ${i + 1}`} onClick={() => scrollToIndex(i)} />
              ))}
            </div>
            <div className="rst-carousel__arrows">
              <button className="rst-arrow" aria-label="Zurück" disabled={active === 0}
                onClick={() => scrollToIndex(Math.max(0, active - 1))}>
                <Icon name="arrow-left" size={18} />
              </button>
              <button className="rst-arrow" aria-label="Weiter" disabled={active === PROCESS.length - 1}
                onClick={() => scrollToIndex(Math.min(PROCESS.length - 1, active + 1))}>
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="rst-show__cta">
          <ButtonLink as={Link} to="/anfrage" variant="hero" size="md">Angebot erhalten</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function workBadge(label) {
  if (!label) return null;
  const l = label.toLowerCase();
  if (l.includes("bearbeit")) return <Badge tone="success" dot>{label}</Badge>;
  if (l.includes("prüf") || l.includes("pruef")) return <Badge tone="warning" dot>{label}</Badge>;
  return <Badge tone="brand">{label}</Badge>;
}

function Featured() {
  return (
    <section id="atelier" className="rst-section">
      <SectionHead eyebrow="Aus dem Atelier" title="Aktuelle Behandlungen" />
      <div className="rst-works-grid">
        {WORKS.map((w, i) => (
          <WorkCard
            key={i}
            title={w.title}
            artist={w.artist}
            meta={w.meta}
            status={workBadge(w.statusLabel)}
            image={w.image ? w.image : <Plate ratio="4/5" tone={w.tone ?? i % 4} />}
          />
        ))}
      </div>
    </section>
  );
}

function ClosingCTA() {
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
          {FAQ.map((it, i) => (
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
  const c = CONTACT;
  return (
    <footer className="rst-footer">
      <div className="rst-footer__grid">
        <div>
          <div className="rst-hero-wordmark">Westermeier<br />Restaurierung</div>
          <p className="rst-footer__lede">Ein Atelier für die Restaurierung von Gemälden, Papier und Objekten.</p>
        </div>
        <div>
          <div className="rst-footer__col-h">Atelier</div>
          <div className="rst-footer__links">
            {["Leistungen", "Das Team", "Journal", "Karriere"].map((l) => <a key={l} href="#">{l}</a>)}
          </div>
        </div>
        <div>
          <div className="rst-footer__col-h">Sammler</div>
          <div className="rst-footer__links">
            <Link to="/anfrage">Beratung anfragen</Link>
            <Link to="/login">Kundenportal</Link>
            <a href="#">Versicherung</a>
            <a href="#">Versand</a>
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

export default function HomePage() {
  return (
    <div className="rst-site">
      <SiteHeader />
      <Hero />
      <Services />
      <ProcessCarousel />
      <Featured />
      <ClosingCTA />
      <SiteFooter />
    </div>
  );
}
