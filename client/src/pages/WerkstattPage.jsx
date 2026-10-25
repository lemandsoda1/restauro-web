import { SubHeader, SiteFooter } from "../components/SiteChrome";
import { ButtonLink, Plate, Icon } from "../ds";
import { Link } from "react-router-dom";

/* ============================================================================
 * WERKSTÄTTE — hier direkt im Code pflegen. Bilder sind Platzhalter-Platten;
 * Fotos später in client/public/werkstatt/ ablegen und statt Plate ein <img>
 * einsetzen (Struktur analog zu TeamPage/HomePage).
 * ==========================================================================*/
const GALLERY = [
  { label: "Der Werkraum", tone: 0, big: true },
  { label: "Arbeitstisch & Bildgebung", tone: 1 },
  { label: "Kitt, Pigmente & Retusche", tone: 2 },
  { label: "Vergoldung", tone: 3 },
  { label: "Klimatisiertes Depot", tone: 1 },
];

const FEATURES = [
  { title: "Technische Ausstattung", text: "UV-, Infrarot- und Streiflicht-Untersuchung sowie ein eigener Arbeitstisch mit Lupenleuchte für die Detailarbeit an Porzellan und feinen Objekten." },
  { title: "Klimatisierte Räume", text: "Temperatur und Luftfeuchte werden in Werk- und Lagerräumen konstant gehalten — entscheidend für empfindliche Materialien." },
  { title: "Sicherheit & Versicherung", text: "Videoüberwachtes Atelier, versicherte Lagerung und ein dokumentierter Übergabeprozess für jedes Objekt." },
  { title: "Werkbänke nach Gewerk", text: "Getrennte Arbeitsbereiche für Porzellan und Keramik, Holz und Vergoldung sowie Skulptur — jede mit eigenem Werkzeug und Materiallager." },
];

const FACTS = [
  { num: "300 m²", label: "Atelier- und Depotfläche" },
  { num: "35+", label: "Jahre Erfahrung im Haus" },
  { num: "4", label: "Fachbereiche unter einem Dach" },
];

export default function WerkstattPage() {
  return (
    <div className="rst-site">
      <SubHeader />

      <section className="rst-section">
        <div className="rst-intro">
          <div>
            <span className="rst-intro__eyebrow">Die Werkstätte</span>
            <h1 className="rst-intro__title">Ein Ort für behutsame Arbeit</h1>
          </div>
          <div className="rst-intro__text">
            <p>
              Die Werkstätte wurde vor über 35 Jahren gegründet und hat sich seither zu einem Ort
              entwickelt, an dem Handwerk, wissenschaftliche Untersuchung und künstlerisches Gespür
              zusammenkommen. Jedes Objekt, das uns erreicht, durchläuft zunächst eine sorgfältige
              Bestandsaufnahme, bevor überhaupt ein erster Handgriff erfolgt.
            </p>
            <p>
              Die Räume sind bewusst nach Gewerk getrennt: Porzellan und Keramik, Holz und Vergoldung
              sowie Skulptur haben jeweils eigene Arbeitsbereiche, eigenes Werkzeug und eigene
              klimatische Anforderungen. So entsteht Raum für Konzentration, ohne dass sich die
              Materialien und Prozesse der einzelnen Disziplinen gegenseitig stören.
            </p>
            <p>
              Museen, Stiftungen und private Sammler vertrauen uns ihre wertvollsten Objekte an, weil
              jede Entscheidung dokumentiert und nachvollziehbar bleibt. Von der ersten Fotografie bis
              zur Rückgabe begleiten wir jedes Projekt mit dem gleichen Maß an Sorgfalt — unabhängig
              davon, ob es sich um eine große Prunkvase oder eine kleine Porzellanfigur handelt.
            </p>
          </div>
        </div>

        <div className="rst-gallery" style={{ marginTop: 56 }}>
          {GALLERY.map((g, i) => (
            <Plate key={i} tone={g.tone} label={g.label} ratio="1/1"
              className={g.big ? "rst-gallery__item--big" : ""} />
          ))}
        </div>

        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="rst-recommend__row">
              <h3 className="rst-recommend__title">{f.title}</h3>
              <p className="rst-recommend__text">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="rst-facts">
          {FACTS.map((f, i) => (
            <div key={i}>
              <div className="rst-facts__num">{f.num}</div>
              <div className="rst-facts__label">{f.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 56 }}>
          <ButtonLink as={Link} to="/anfrage" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>
            Fotos hochladen & Angebot erhalten
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
