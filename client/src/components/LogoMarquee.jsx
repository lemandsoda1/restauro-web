/* Auto-scrolling, seamless institutional-client logo carousel — shared by the
   homepage and the References page. Each entry is either an image
   ({ name, src: "/logos/xyz.png" }) or, before a logo exists, just
   { name } (rendered as a text wordmark placeholder). Drop new logos in
   client/public/logos/ and add a line here. */
export const LOGOS = [
  { name: "Bayerische Schlösserverwaltung", src: "/logos/bayerische-schloesserverwaltung.png" },
  { name: "Erzbistum Berlin", src: "/logos/erzbistum-berlin.png" },
  { name: "Stiftung Fürst Liechtenstein", src: "/logos/stiftung-fuerst-liechtenstein.png" },
  { name: "Bistum Regensburg", src: "/logos/bistum-regensburg.png" },
  { name: "Kunsthistorisches Museum Wien", src: "/logos/kunsthistorisches-museum-wien.png" },
  { name: "Staatliches Bauamt Rosenheim", src: "/logos/staatliches-bauamt-rosenheim.png" },
  { name: "Erzdiözese München und Freising", src: "/logos/erzdioezese-muenchen-freising.png" },
];

export default function LogoMarquee({ eyebrow = "" }) {
  if (!LOGOS.length) return null;
  // Tile the set so one "half" is wide enough to fill the viewport, then
  // render it twice so the -50% CSS loop is seamless regardless of count.
  const reps = Math.max(2, Math.ceil(14 / LOGOS.length));
  const half = Array.from({ length: reps }, () => LOGOS).flat();
  const loop = [...half, ...half];
  return (
    <section className="rst-logos" aria-label="Referenzen und Partner">
      {eyebrow ? <p className="rst-logos__eyebrow">{eyebrow}</p> : null}
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
