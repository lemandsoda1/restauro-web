import { useState, useEffect } from "react";

/** Default homepage content — used as fallback until edited in the CMS. */
export const DEFAULT_CONTENT = {
  hero: {
    title: "Werkstätte für Kunstrestaurierung und Konservierung",
    lede: "Ein Atelier für Gemälde, Fresken, Papierarbeiten und Objekte — wissenschaftliche Sorgfalt und die geduldige Hand des Restaurators.",
  },
  stats: [
    { n: "1.400+", l: "Restaurierte Werke" },
    { n: "35 Jahre", l: "Erfahrung" },
    { n: "48 Std.", l: "Bis zum Angebot" },
  ],
  services: [
    { icon: "scan-line", title: "Begutachtung & Bildgebung", text: "Technische Untersuchung — UV-, Infrarot- und Streiflicht — zur Kartierung des Zustands und als Grundlage jeder Behandlung." },
    { icon: "brush", title: "Reinigung & Restaurierung", text: "Oberflächenreinigung, strukturelle Reparatur, Retusche und Neufirnis durch Fachrestauratoren." },
    { icon: "frame", title: "Rahmung & Montierung", text: "Konservatorische Rahmung, Verglasung und archivfeste Montierungen, individuell auf jedes Werk abgestimmt." },
    { icon: "shield-check", title: "Präventive Konservierung", text: "Klimauntersuchungen, Pflegekonzepte für Sammlungen und Zustandskontrolle über die Zeit." },
  ],
  steps: [
    { n: "01", title: "Fotos hochladen", text: "Fotografieren Sie Ihr Werk aus mehreren Winkeln — Schäden, Details und Gesamtzustand.", meta: "JPG, PNG oder WebP · bis zu 10 Bilder" },
    { n: "02", title: "Angebot erhalten", text: "Unsere Restauratoren beurteilen den Zustand und erstellen ein detailliertes, unverbindliches Angebot.", meta: "Innerhalb von 48 Stunden" },
    { n: "03", title: "Fortschritt verfolgen", text: "Geben Sie das Angebot frei und verfolgen Sie den Weg Ihres Werks bis zur Fertigstellung im Portal.", meta: "Transparenter Status in Echtzeit" },
  ],
  faq: [
    { q: "Wie lange dauert eine Behandlung?", a: "Die meisten Behandlungen dauern je nach Umfang und Zustand 4–12 Wochen." },
    { q: "Holen Sie das Werk ab?", a: "Ja — versicherte Abholung und Rücklieferung sind innerhalb der Region inbegriffen." },
    { q: "Erhalte ich eine Dokumentation?", a: "Jedes Projekt schließt mit einem vollständigen fotografischen Zustands- und Behandlungsbericht ab." },
  ],
  contact: {
    email: "hallo@westermeier-restaurierung.de",
    phone: "+49 89 000 0000",
    address: "Kunststraße 18, München",
  },
  imprint: "",
};

/** Default reference works (shown until real ones are added in the CMS). */
export const DEFAULT_WORKS = [
  { id: "d1", title: "Marine bei Dämmerung", artist: "Umkreis C.-J. Vernet", meta: "Öl auf Leinwand · um 1774", status_label: "In Bearbeitung", image_url: null, tone: 1 },
  { id: "d2", title: "Handstudie", artist: "zugeschr. G. Reni", meta: "Rötel auf Papier", status_label: "In Prüfung", image_url: null, tone: 0 },
  { id: "d3", title: "Vergoldeter Konsolentisch", artist: "Louis-XV-Zeit", meta: "Geschnitztes Goldholz", status_label: "Abgeschlossen", image_url: null, tone: 2 },
  { id: "d4", title: "Bildnis einer Dame", artist: "Niederländische Schule", meta: "Öl auf Holz · um 1620", status_label: "Abgeschlossen", image_url: null, tone: 3 },
];

function deepMerge(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) && override.length ? override : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const k of Object.keys(base)) {
      if (override && override[k] != null) out[k] = deepMerge(base[k], override[k]);
    }
    return out;
  }
  return override != null ? override : base;
}

/** Fetches CMS content once; merges over defaults so the page always renders. */
export function useSiteContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [works, setWorks] = useState(DEFAULT_WORKS);

  useEffect(() => {
    let alive = true;
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        if (data.content) setContent(deepMerge(DEFAULT_CONTENT, data.content));
        if (Array.isArray(data.works) && data.works.length) setWorks(data.works);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return { content, works };
}
