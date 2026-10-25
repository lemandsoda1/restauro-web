import { LOGOS } from "../components/LogoMarquee";
import { Rich, Button, SiteHeader, SiteFooter } from "../components/SiteChrome";

/* ============================================================================
 * STARTSEITE — Inhalte hier direkt pflegen. Im Text steht *…* für die
 * Serif-Kursive (Akzent mitten im Satz). Bilder: src setzen (Datei nach
 * client/public/ legen); solange src fehlt, zeigt der Platzhalter, welches
 * Foto gebraucht wird. Kontaktdaten + Footer-Satz: components/SiteChrome.jsx.
 * ==========================================================================*/
const CONTENT = {
  hero: {
    image: "/hero.webp",
    text: "Wir restaurieren Kunstobjekte und Kunsthandwerk — *mit Geduld, Wissen und Respekt vor dem Original.*",
    button: { label: "Angebot anfragen", to: "/anfrage" },
  },
  intro: {
    tiles: [
      { src: null, ph: "Foto: Porzellanvase, Detail", caption: "Prunkvase / *Porzellan* / Bayerische Schlösserverwaltung" },
      { src: null, ph: "Foto: Fayence-Platte vor/nach", caption: "Fayence-Platte / *17. Jh.* / Kunsthistorisches Museum Wien" },
    ],
    statement: "Seit über 35 Jahren untersuchen, konservieren und restaurieren wir Kunstobjekte — *von der großen Prunkvase bis zur kleinen Porzellanfigur.*",
    button: { label: "Leistungen ansehen", href: "#leistungen" },
  },
  services: {
    label: "Leistungen",
    rows: [
      { title: "Begutachtung & Bildgebung", text: "Technische Untersuchung mit UV-, Infrarot- und Streiflicht — zur Kartierung des Zustands und als Grundlage jeder Behandlung." },
      { title: "Reinigung & Restaurierung", text: "Oberflächenreinigung, Kleben und Ergänzen, Retusche und Oberflächenschutz durch Fachrestauratoren." },
      { title: "Montierung & Aufbewahrung", text: "Konservatorische Sockel, Vitrinenmontage und archivfeste Lagerung, individuell auf jedes Objekt abgestimmt." },
      { title: "Präventive Konservierung", text: "Klimauntersuchungen, Pflegekonzepte für Sammlungen und Zustandskontrolle über die Zeit." },
    ],
  },
  feature: {
    src: null,
    ph: "Foto/Video: Hände bei der Arbeit in der Werkstatt",
    label: "Die Werkstätte",
    text: "Klimatisierte Räume, getrennt nach Gewerk — *ein Ort für behutsame Arbeit.*",
    button: { label: "Werkstätte ansehen", to: "/werkstatt" },
  },
  works: {
    statement: "Aus der Werkstätte: *aktuelle Restaurierungen* für Museen, Stiftungen und private Sammler.",
    button: { label: "Alle Referenzen", to: "/referenzen" },
    tiles: [
      { src: null, ph: "Foto: Deckelterrine", caption: "Deckelterrine / *Porzellan, bemalt* / um 1760" },
      { src: null, ph: "Foto: Konsolentisch, Vergoldung", caption: "Vergoldeter Konsolentisch / *Louis-XV-Zeit* / Goldholz" },
    ],
  },
  process: {
    label: "So funktioniert es",
    rows: [
      { title: "Fotos hochladen", text: "Laden Sie Fotos Ihres Objekts aus mehreren Winkeln hoch — Schäden, Details und Gesamtzustand." },
      { title: "Bewertung & Angebot", text: "Wir prüfen Zustand und Anforderungen und senden Ihnen ein unverbindliches Angebot." },
      { title: "Restaurierung & Rückgabe", text: "Nach Ihrer Zusage restaurieren wir das Objekt, dokumentieren jeden Schritt und senden es versichert zurück." },
    ],
  },
  press: {
    lead: "Wir arbeiten für Museen, Stiftungen, Diözesen und private Sammler.",
  },
};

function Media({ src, ph, alt = "" }) {
  return (
    <div className="tpl-media">
      {src ? <img src={src} alt={alt} /> : <div className="tpl-media__ph">{ph}</div>}
    </div>
  );
}

function Tile({ tile }) {
  return (
    <figure className="tpl-tile">
      <Media src={tile.src} ph={tile.ph} />
      <figcaption className="tpl-caption"><Rich text={tile.caption} /></figcaption>
    </figure>
  );
}

function Hero() {
  const h = CONTENT.hero;
  return (
    <section className="tpl-hero">
      <div className="tpl-hero__media"><img src={h.image} alt="" /></div>
      <div className="tpl-hero__scrim" />
      <div className="tpl-hero__content tpl-grid">
        <div className="tpl-hero__text">
          <p><Rich text={h.text} /></p>
          <Button {...h.button} light />
        </div>
      </div>
    </section>
  );
}

/* Zwei Bilder in Spalte 1–2, darunter ein Statement ab Spalte 2 */
function TilesAndStatement({ tiles, statement, button, statementFirst = false }) {
  const tileRow = tiles.map((t, i) => <Tile key={i} tile={t} />);
  const text = (
    <div className={`tpl-col-2-end tpl-statement tpl-statement--${statementFirst ? "before" : "after"}`}>
      <p><Rich text={statement} /></p>
      {button ? <Button {...button} /> : null}
    </div>
  );
  return (
    <section className="tpl-section tpl-grid">
      {statementFirst ? text : null}
      {tileRow}
      {statementFirst ? null : text}
    </section>
  );
}

function Rows({ id, label, rows, numbered = false }) {
  return (
    <section id={id} className="tpl-section tpl-grid">
      <h2 className="tpl-col-1 tpl-label tpl-rows__label">{label}</h2>
      <div className="tpl-col-2-end tpl-rows">
        {rows.map((r, i) => (
          <div className="tpl-row" key={i}>
            <h3 className="tpl-row__title">
              {numbered ? <span className="tpl-row__index">{`Schritt ${i + 1}`}</span> : null}
              {r.title}
            </h3>
            <p className="tpl-row__text">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Feature() {
  const f = CONTENT.feature;
  return (
    <section className="tpl-section" style={{ padding: "var(--tpl-space-m) var(--tpl-gutter) 0" }}>
      <div className={`tpl-feature${f.src ? "" : " tpl-feature--ph"}`}>
        <Media src={f.src} ph={f.ph} />
        <div className="tpl-feature__overlay">
          <span className="tpl-label">{f.label}</span>
          <p><Rich text={f.text} /></p>
          <Button {...f.button} light={!!f.src} />
        </div>
      </div>
    </section>
  );
}

function Press() {
  return (
    <section className="tpl-section tpl-grid tpl-press">
      <p className="tpl-col-1 tpl-press__lead">{CONTENT.press.lead}</p>
      <div className="tpl-col-2-end tpl-press__logos">
        {LOGOS.map((l) => (l.src ? <img key={l.name} src={l.src} alt={l.name} loading="lazy" /> : <span key={l.name}>{l.name}</span>))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const c = CONTENT;
  return (
    <div className="tpl">
      <SiteHeader overHero />
      <Hero />
      <TilesAndStatement {...c.intro} />
      <Rows id="leistungen" {...c.services} />
      <Feature />
      <TilesAndStatement {...c.works} statementFirst />
      <Rows {...c.process} numbered />
      <Press />
      <SiteFooter />
    </div>
  );
}
