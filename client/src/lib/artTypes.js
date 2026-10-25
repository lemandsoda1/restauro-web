/* Object categories — value stored in DB (english) → German label. */
export const ART_TYPES = [
  { value: "porcelain", label: "Porzellan" },
  { value: "ceramics", label: "Keramik" },
  { value: "sculpture", label: "Skulptur" },
  { value: "furniture", label: "Möbel" },
  { value: "frame", label: "Rahmen" },
  { value: "object", label: "Kunsthandwerk / Objekt" },
  { value: "other", label: "Sonstiges" },
];

// Nicht mehr auswählbar (wir restaurieren keine Gemälde), aber bestehende
// Anfragen in der Datenbank sollen weiter eine Bezeichnung zeigen.
const LEGACY = { painting: "Gemälde", paper: "Papierarbeit" };

const MAP = { ...LEGACY, ...Object.fromEntries(ART_TYPES.map((t) => [t.value, t.label])) };

export function artTypeLabel(value) {
  return MAP[value] || value || "";
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatShortDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}
