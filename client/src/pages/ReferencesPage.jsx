import { SubHeader, SiteFooter } from "../components/SiteChrome";
import LogoMarquee from "../components/LogoMarquee";
import { Plate, ButtonLink, Icon } from "../ds";

/* ============================================================================
 * REFERENZEN — hier direkt im Code pflegen. Institutionen orientieren sich an
 * den Partnern aus LogoMarquee. Bilder sind Platzhalter-Platten; Fotos später
 * in client/public/referenzen/ ablegen und statt Plate ein <img> einsetzen.
 * ==========================================================================*/
const CASES = [
  {
    tag: "Porzellan",
    institution: "Bayerische Schlösserverwaltung",
    title: "Prunkvase mit Goldstaffage, 18. Jh.",
    text: "Mehrfach gebrochene Vase mit alten, vergilbten Klebungen und Fehlstellen an Henkel und Fuß. Abnahme der früheren Verklebung, Neuverklebung, Ergänzung der Fehlstellen und behutsame Retusche nach Befund.",
    result: "Bruchstellen kaum sichtbar, Zustand dokumentiert",
    tone: 0,
  },
  {
    tag: "Keramik",
    institution: "Kunsthistorisches Museum Wien",
    title: "Fayence-Platte, 17. Jh.",
    text: "Zerscherbte Platte mit überfassten, späteren Ergänzungen, die die originale Bemalung verdeckten. Abnahme der Übermalungen, Neuverklebung der Scherben und farblich angepasste Ergänzung der Fehlstellen.",
    result: "Originaloberfläche freigelegt",
    tone: 1,
  },
  {
    tag: "Möbel & Vergoldung",
    institution: "Stiftung Fürst Liechtenstein",
    title: "Vergoldeter Konsolentisch, Louis-XV-Zeit",
    text: "Abplatzungen im Blattgold und ein gerissener Schnitzaufbau. Ergänzung fehlender Schnitzteile, Neuvergoldung in traditioneller Ölvergoldung und Anpassung der Patina an den Bestand.",
    result: "ausstellungsfähig, Rückgabe termingerecht",
    tone: 2,
  },
  {
    tag: "Skulptur",
    institution: "Erzdiözese München und Freising",
    title: "Gefasste Heiligenfigur, süddeutsch",
    text: "Rissbildung im Holzkern und abblätternde originale Fassung. Klimatische Stabilisierung, Festigung der Fassung und punktuelle Retusche unter Erhalt der historischen Oberfläche.",
    result: "originale Fassung erhalten",
    tone: 3,
  },
];

function ReferencesHero() {
  const [featured, peek1, peek2] = CASES;
  return (
    <section className="rst-refhero">
      <div className="rst-refhero__inner">
        <div className="rst-refhero__content">
          <span className="rst-refhero__eyebrow">Referenzen</span>
          <h1 className="rst-refhero__title">{featured.tag}:<br />{featured.title}</h1>
          <ButtonLink as="a" href="#projekte" variant="invert" size="md" endIcon={<Icon name="arrow-right" size={16} />}>
            Alle Projekte
          </ButtonLink>
        </div>
        <div className="rst-refhero__media">
          <div className="rst-refhero__main"><Plate tone={featured.tone} /></div>
          {peek1 ? <div className="rst-refhero__peek"><Plate tone={peek1.tone} /></div> : null}
          {peek2 ? <div className="rst-refhero__peek"><Plate tone={peek2.tone} /></div> : null}
        </div>
      </div>
    </section>
  );
}

export default function ReferencesPage() {
  return (
    <div className="rst-site">
      <SubHeader />
      <ReferencesHero />

      <section className="rst-section">
        <div className="rst-intro">
          <div>
            <span className="rst-intro__eyebrow">Ausgewählte Projekte</span>
            <h2 className="rst-intro__title">Projekte, die uns geprägt haben</h2>
          </div>
          <div className="rst-intro__text">
            <p>
              Die folgende Auswahl zeigt abgeschlossene Restaurierungen für Museen, Stiftungen und
              private Sammler — von der großen Prunkvase bis zur kleinen, gefassten Skulptur.
              Jedes Projekt ist unterschiedlich, doch der Ablauf folgt immer demselben Prinzip: erst der
              technische Befund, dann das Konzept, erst danach die eigentliche Behandlung.
            </p>
            <p>
              Uns ist wichtig, dass jede Entscheidung nachvollziehbar bleibt — für die Institution, die
              uns ein Objekt anvertraut, ebenso wie für künftige Restauratorinnen und Restauratoren, die
              einmal auf unsere Dokumentation zurückgreifen werden.
            </p>
          </div>
        </div>

        <div id="projekte" style={{ marginTop: 8 }}>
          {CASES.map((c, i) => (
            <article className="rst-recommend__row" key={i}>
              <div>
                <div className="rst-case__tag">{c.tag}</div>
                <div className="rst-case__institution">{c.institution}</div>
                <h2 className="rst-recommend__title" style={{ marginTop: 10 }}>{c.title}</h2>
              </div>
              <div>
                <p className="rst-recommend__text">{c.text}</p>
                <div className="rst-case__result"><strong>Ergebnis</strong> {c.result}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LogoMarquee eyebrow="Weitere Institutionen und Sammlungen, die uns vertrauen" />

      <SiteFooter />
    </div>
  );
}
