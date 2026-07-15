import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ButtonLink, WorkCard, Badge, Plate, Icon } from "../ds";
import SiteFooter from "../components/SiteFooter";
import LogoMarquee from "../components/LogoMarquee";

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

const SERVICES = [
  { title: "Begutachtung & Bildgebung", text: "Technische Untersuchung — UV-, Infrarot- und Streiflicht — zur Kartierung des Zustands und als Grundlage jeder Behandlung." },
  { title: "Reinigung & Restaurierung", text: "Oberflächenreinigung, strukturelle Reparatur, Retusche und Neufirnis durch Fachrestauratoren." },
  { title: "Rahmung & Montierung", text: "Konservatorische Rahmung, Verglasung und archivfeste Montierungen, individuell auf jedes Objekt abgestimmt." },
  { title: "Präventive Konservierung", text: "Klimauntersuchungen, Pflegekonzepte für Sammlungen und Zustandskontrolle über die Zeit." },
];

const FAQ = [
  { q: "Wie lange dauert eine Behandlung?", a: "Die meisten Behandlungen dauern je nach Umfang und Zustand 4–12 Wochen." },
  { q: "Holen Sie das Objekt ab?", a: "Ja — versicherte Abholung und Rücklieferung sind innerhalb der Region inbegriffen." },
  { q: "Erhalte ich eine Dokumentation?", a: "Jedes Projekt schließt mit einem vollständigen fotografischen Zustands- und Behandlungsbericht ab." },
];

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
  const links = [["Services", "#leistungen"], ["Werkstätte", "/werkstatt"], ["Referenzen", "/referenzen"]];
  const ctaVariant = scrolled ? "primary" : "hero";
  return (
    <header className={`rst-header rst-header--overlay ${scrolled ? "rst-header--scrolled" : "rst-header--hero"}`}>
      <div className="rst-header__bar">
        <Link to="/" className="rst-hero-wordmark">Westermeier<br />Restaurierung</Link>
        <nav className="rst-header__nav">
          {links.map(([l, href]) => href.startsWith("#") ? <a key={l} href={href}>{l}</a> : <Link key={l} to={href}>{l}</Link>)}
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
          {links.map(([l, href]) => {
            const style = { display: "block", padding: "10px 0", fontFamily: "var(--font-grotesque)", fontWeight: 500, color: "var(--stone-700)" };
            return href.startsWith("#")
              ? <a key={l} href={href} onClick={() => setMenuOpen(false)} style={style}>{l}</a>
              : <Link key={l} to={href} onClick={() => setMenuOpen(false)} style={style}>{l}</Link>;
          })}
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

function Services() {
  const [open, setOpen] = useState(-1);
  const toggle = (i) => setOpen((o) => (o === i ? -1 : i));
  return (
    <section id="leistungen" className="rst-section" style={{ paddingBottom: 40 }}>
      <div className="rst-intro">
        <div>
          <span className="rst-intro__eyebrow">Was wir tun</span>
          <h2 className="rst-intro__title">Leistungen</h2>
        </div>
        <div className="rst-intro__text">
          <p>
            Von der ersten technischen Untersuchung bis zur präventiven Pflege einer ganzen Sammlung —
            wir decken die vollständige Bandbreite der Kunstrestaurierung ab. Jede Behandlung beginnt
            mit einer Bildgebung, die den Zustand des Objekts sichtbar macht, bevor eine einzige
            Entscheidung getroffen wird.
          </p>
          <p>
            Reinigung, Retusche, Rahmung und Montierung führen unsere Fachrestauratorinnen und
            -restauratoren jeweils in ihrem eigenen Gewerk aus. So bleibt jede Leistung so spezialisiert,
            wie es das Material verlangt.
          </p>
          <Plate ratio="16/9" tone={1} label="Atelier" />
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rst-recommend__row rst-recommend__row--toggle" onClick={() => toggle(i)}>
              <h3 className="rst-recommend__title rst-recommend__title--toggle">
                {s.title}
                <Icon name={isOpen ? "minus" : "plus"} size={18} />
              </h3>
              {isOpen ? (
                <div>
                  <p className="rst-recommend__text">{s.text}</p>
                  <Plate ratio="16/9" tone={i % 4} style={{ marginTop: 16 }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Der komplette Ablauf als Zeilen-Liste (dunkle Section). Reihenfolge/Texte hier pflegen.
const PROCESS = [
  { title: "Foto hochladen", text: "Laden Sie Fotos Ihres Objekts aus mehreren Winkeln hoch — Schäden, Details und Gesamtzustand." },
  { title: "Durchsicht & Bewertung", text: "Unsere Experten prüfen Zustand und Anforderungen des Objekts sorgfältig." },
  { title: "Angebot", text: "Sie erhalten ein unverbindliches Angebot für die Restaurierung des Objekts." },
  { title: "Versand zu uns", text: "Nach Freigabe senden Sie das Objekt versichert an unser Atelier." },
  { title: "Restaurierung", text: "Wir restaurieren Ihr Objekt fachgerecht und gemäß dem vereinbarten Angebot." },
  { title: "Dokumentation & Rückversand", text: "Vollständige Foto­dokumentation und sicherer Rückversand an Sie." },
];

/* Reusable card carousel: scroll-snap track + prev/next arrows + progress dots.
   `light` switches the controls to the dark-on-light theme. */
function Carousel({ items, renderItem, light = false, itemClass = "", label = "Element" }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // reference point = the track's content-left (past the full-bleed inline padding)
  const contentLeft = (track) => track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft || 0);

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    const item = track && track.children[i];
    if (!track || !item) return;
    const delta = item.getBoundingClientRect().left - contentLeft(track);
    track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const ref = contentLeft(track);
    let best = 0, bestD = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - ref);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
    // fade a side only when there is content to scroll that way
    const max = track.scrollWidth - track.clientWidth;
    track.style.setProperty("--fl", track.scrollLeft > 4 ? "72px" : "0px");
    track.style.setProperty("--fr", track.scrollLeft < max - 4 ? "72px" : "0px");
  };

  useEffect(() => { onScroll(); }, []);

  return (
    <div className={`rst-carousel${light ? " rst-carousel--light" : ""}`}>
      <div className="rst-carousel__track" ref={trackRef} onScroll={onScroll}>
        {items.map((it, i) => (
          <div className={`rst-carousel__item${itemClass ? " " + itemClass : ""}`} key={i}>
            {renderItem(it, i)}
          </div>
        ))}
      </div>
      <div className="rst-carousel__controls">
        <div className="rst-carousel__dots">
          {items.map((_, i) => (
            <button key={i} className={`rst-dot${i === active ? " rst-dot--active" : ""}`}
              aria-label={`Zu ${label} ${i + 1}`} onClick={() => scrollToIndex(i)} />
          ))}
        </div>
        <div className="rst-carousel__arrows">
          <button className="rst-arrow" aria-label="Zurück" disabled={active === 0}
            onClick={() => scrollToIndex(Math.max(0, active - 1))}>
            <Icon name="arrow-left" size={18} />
          </button>
          <button className="rst-arrow" aria-label="Weiter" disabled={active === items.length - 1}
            onClick={() => scrollToIndex(Math.min(items.length - 1, active + 1))}>
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Process() {
  return (
    <section className="rst-show" id="ablauf" aria-label="Ablauf in sechs Schritten">
      <div className="rst-show__inner" style={{ paddingTop: 56 }}>
        <div className="rst-intro rst-intro--dark">
          <div>
            <span className="rst-intro__eyebrow">So funktioniert es</span>
            <h2 className="rst-intro__title">In drei Schritten zum <em>Angebot</em></h2>
          </div>
          <div className="rst-intro__text">
            <p>
              Vom ersten Foto bis zur Rückgabe begleiten wir Sie durch einen klar strukturierten
              Ablauf. Nach der Zusage übernehmen wir Versand, Restaurierung und eine vollständige
              Dokumentation — Sie müssen sich um nichts weiter kümmern.
            </p>
          </div>
        </div>

        <div className="rst-recommend--dark" style={{ marginTop: 24 }}>
          {PROCESS.map((p, i) => (
            <div className="rst-recommend__row" key={i}>
              <div>
                <span className="rst-refhero__eyebrow">{`Schritt ${i + 1}`}</span>
                <h3 className="rst-recommend__title" style={{ marginTop: 10 }}>{p.title}</h3>
              </div>
              <p className="rst-recommend__text">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="rst-show__cta">
          <p className="rst-show__cta-lead">Bereit, Ihr Objekt in gute Hände zu geben?</p>
          <ButtonLink as={Link} to="/anfrage" variant="accent" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>
            Angebot erhalten
          </ButtonLink>
          <p className="rst-show__note">
            Für institutionelle Kunden — <a href="mailto:hallo@westermeier-restaurierung.de">nehmen Sie hier Kontakt mit uns auf</a>.
          </p>
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
      <div className="rst-intro" style={{ marginBottom: 40 }}>
        <div>
          <span className="rst-intro__eyebrow">Aus der Werkstätte</span>
          <h2 className="rst-intro__title">Aktuelle Restaurierungen</h2>
        </div>
        <div className="rst-intro__text">
          <p>
            Ein Ausschnitt aus laufenden und kürzlich abgeschlossenen Projekten — vom barocken
            Ölgemälde bis zum vergoldeten Konsolentisch. Jedes Objekt durchläuft bei uns dieselbe
            sorgfältige Bearbeitung, unabhängig von Größe oder Wert.
          </p>
        </div>
      </div>
      <Carousel light label="Objekt" items={WORKS} itemClass="rst-carousel__item--work" renderItem={(w, i) => (
        <WorkCard
          title={w.title}
          artist={w.artist}
          meta={w.meta}
          status={workBadge(w.statusLabel)}
          image={w.image ? w.image : <Plate ratio="4/5" tone={w.tone ?? i % 4} />}
        />
      )} />
    </section>
  );
}

function ClosingCTA() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="kontakt" className="rst-cta">
      <div className="rst-cta__inner">
        <div className="rst-intro rst-intro--dark">
          <div>
            <span className="rst-intro__eyebrow">Beginnen</span>
            <h2 className="rst-intro__title">Ein Objekt, das Pflege braucht?</h2>
          </div>
          <div className="rst-intro__text">
            <p>Teilen Sie uns einige Details und Fotografien mit. Ein Restaurator meldet sich innerhalb von zwei Werktagen.</p>
            <div>
              <ButtonLink as={Link} to="/anfrage" size="lg" variant="hero" endIcon={<Icon name="arrow-right" size={16} />}>Beratung anfragen</ButtonLink>
            </div>
          </div>
        </div>

        <div className="rst-recommend--dark" style={{ marginTop: 40 }}>
          {FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rst-recommend__row rst-recommend__row--toggle" onClick={() => setOpen(isOpen ? -1 : i)}>
                <h3 className="rst-recommend__title rst-recommend__title--toggle">
                  {it.q}
                  <Icon name={isOpen ? "minus" : "plus"} size={18} />
                </h3>
                {isOpen ? <p className="rst-recommend__text">{it.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Layout-Test „Wir empfehlen" — editorial-Liste, Titel/Text hier pflegen.
const RECOMMEND = [
  { title: "Serie: Material & Patina", text: "Eine kurze Einführung in die Materialien der Restaurierung — von Pigmenten über Bindemittel bis zur Alterung von Firnis." },
  { title: "Klima im Atelier: ein Leitfaden", text: "Warum Temperatur und Luftfeuchte über Erfolg oder Schaden einer Behandlung entscheiden — und wie wir sie im Atelier steuern." },
  { title: "Vom Befund zur Behandlung", text: "Wie aus einer technischen Untersuchung ein Restaurierungskonzept wird, Schritt für Schritt erklärt." },
];

function Recommend() {
  return (
    <section className="rst-section">
      <div className="rst-recommend__head">
        <span className="rst-recommend__eyebrow">Wir empfehlen</span>
      </div>
      <div>
        {RECOMMEND.map((r, i) => (
          <div key={i} className="rst-recommend__row">
            <h3 className="rst-recommend__title">{r.title}</h3>
            <p className="rst-recommend__text">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="rst-site">
      <SiteHeader />
      <Hero />
      <Services />
      <Process />
      <Featured />
      <ClosingCTA />
      <Recommend />
      <SiteFooter />
    </div>
  );
}
