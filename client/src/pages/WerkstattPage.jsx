import SubHeader from "../components/SubHeader";
import SiteFooter from "../components/SiteFooter";
import { ButtonLink, Plate, Icon } from "../ds";
import { Link } from "react-router-dom";

/* ============================================================================
 * WERKSTÄTTE — hier direkt im Code pflegen. Bilder sind Platzhalter-Platten;
 * Fotos später in client/public/werkstatt/ ablegen und statt Plate ein <img>
 * einsetzen (Struktur analog zu TeamPage/HomePage).
 * ==========================================================================*/
const GALLERY = [
  { label: "Der Werkraum", tone: 0, big: true },
  { label: "Lichttisch & Bildgebung", tone: 1 },
  { label: "Pigmente & Bindemittel", tone: 2 },
  { label: "Vergoldung", tone: 3 },
  { label: "Klimatisiertes Depot", tone: 1 },
];

const FEATURES = [
  { icon: "scan-line", title: "Technische Ausstattung", text: "UV-, Infrarot- und Streiflicht-Untersuchung sowie ein eigener Lichttisch für die Detailarbeit an Papier und Gemälden." },
  { icon: "sliders-horizontal", title: "Klimatisierte Räume", text: "Temperatur und Luftfeuchte werden in Werk- und Lagerräumen konstant gehalten — entscheidend für empfindliche Materialien." },
  { icon: "shield-check", title: "Sicherheit & Versicherung", text: "Videoüberwachtes Atelier, versicherte Lagerung und ein dokumentierter Übergabeprozess für jedes Objekt." },
  { icon: "brush", title: "Werkbänke nach Gewerk", text: "Getrennte Arbeitsbereiche für Gemälde, Papier, Rahmen und Objekte — jede mit eigenem Werkzeug und Materiallager." },
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
              Die Räume sind bewusst nach Gewerk getrennt: Wandmalerei, Gemälde, Papier und Objekt
              haben jeweils eigene Arbeitsbereiche, eigenes Werkzeug und eigene klimatische
              Anforderungen. So entsteht Raum für Konzentration, ohne dass sich die Materialien und
              Prozesse der einzelnen Disziplinen gegenseitig stören.
            </p>
            <p>
              Museen, Stiftungen und private Sammler vertrauen uns ihre wertvollsten Objekte an, weil
              jede Entscheidung dokumentiert und nachvollziehbar bleibt. Von der ersten Fotografie bis
              zur Rückgabe begleiten wir jedes Projekt mit dem gleichen Maß an Sorgfalt — unabhängig
              davon, ob es sich um ein Deckenfresko oder eine kleine Rötelzeichnung handelt.
            </p>
          </div>
        </div>

        <div className="rst-gallery" style={{ marginTop: 56 }}>
          {GALLERY.map((g, i) => (
            <Plate key={i} tone={g.tone} label={g.label} ratio="1/1"
              className={g.big ? "rst-gallery__item--big" : ""} />
          ))}
        </div>

        <div className="rst-services" style={{ marginTop: 64 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="rst-service">
              <div className="rst-service__icon"><Icon name={f.icon} size={22} /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
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
