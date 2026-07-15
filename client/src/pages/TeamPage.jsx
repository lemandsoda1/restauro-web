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
        <div className="rst-intro">
          <div>
            <span className="rst-intro__eyebrow">Das Atelier</span>
            <h1 className="rst-intro__title">Die Hände hinter der Restaurierung</h1>
          </div>
          <div className="rst-intro__text">
            <p>
              Hinter jedem restaurierten Objekt steht ein kleines Team aus Fachrestauratorinnen und
              -restauratoren, das seine Disziplin über viele Jahre im Handwerk gelernt hat. Wandmalerei,
              Gemälde, Papier und Objekt werden bei uns von jeweils eigenen Spezialistinnen betreut —
              niemand behandelt ein Material, in dem er oder sie nicht ausgebildet ist.
            </p>
            <p>
              Die Zusammenarbeit beginnt bei der ersten Begutachtung und endet erst mit der
              dokumentierten Rückgabe. Dazwischen tauschen sich die Kolleginnen und Kollegen eng aus —
              gerade bei Objekten, die mehrere Gewerke berühren, etwa ein gerahmtes Gemälde mit
              vergoldetem Rahmen.
            </p>
            <p>
              Ergänzt wird das Restauratoren-Team durch die Atelierleitung, die Logistik, Versicherung
              und die Kommunikation mit unseren Kundinnen und Kunden koordiniert — damit sich die
              Fachleute auf das konzentrieren können, was sie am besten können.
            </p>
          </div>
        </div>

        <div className="rst-team" style={{ marginTop: 56 }}>
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
