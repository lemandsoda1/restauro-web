import SubHeader from "../components/SubHeader";
import SiteFooter from "../components/SiteFooter";
import { Plate } from "../ds";

/* ============================================================================
 * TEAM — hier direkt im Code pflegen. Namen sind Platzhalter; Fotos später in
 * client/public/team/ ablegen und statt der Platte ein <img> einsetzen.
 * ==========================================================================*/
const TEAM = [
  { name: "Name Nachname", role: "Gründer & Restaurator", bio: "Über 35 Jahre Erfahrung in der Restaurierung von Gemälden und Fresken." },
  { name: "Name Nachname", role: "Papier- & Grafikrestaurierung", bio: "Behandlung von Zeichnungen, Aquarellen und Druckgrafik auf Papier." },
  { name: "Name Nachname", role: "Objekt- & Rahmenrestaurierung", bio: "Vergoldung, Holz und dekorative Oberflächen — konservatorisch betreut." },
  { name: "Name Nachname", role: "Atelierleitung & Logistik", bio: "Koordination, versicherter Transport und Betreuung unserer Kunden." },
];

export default function TeamPage() {
  return (
    <div className="rst-site">
      <SubHeader />

      <section className="rst-section">
        <div className="rst-reqhead">
          <span className="rst-reqhead__rule" aria-hidden="true" />
          <span className="rst-reqhead__eyebrow">Das Atelier</span>
          <h1 className="rst-reqhead__title">Die Hände hinter der Restaurierung</h1>
          <p className="rst-reqhead__lede">
            Ein kleines Team aus Fachrestauratoren — jede Disziplin in erfahrener Hand,
            von der Begutachtung bis zur Rückgabe.
          </p>
        </div>

        <div className="rst-team">
          {TEAM.map((m, i) => (
            <article className="rst-teamcard" key={i}>
              <Plate ratio="4/5" tone={i % 4} />
              <div className="rst-teamcard__body">
                <div className="rst-teamcard__role">{m.role}</div>
                <h3 className="rst-teamcard__name">{m.name}</h3>
                <p className="rst-teamcard__bio">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
