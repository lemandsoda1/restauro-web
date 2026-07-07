/* Object categories — value stored in DB (english) → German label. */
export const ART_TYPES = [
  { value: "painting", label: "Gemälde" },
  { value: "paper", label: "Papierarbeit" },
  { value: "sculpture", label: "Skulptur" },
  { value: "frame", label: "Rahmen" },
  { value: "ceramics", label: "Keramik" },
  { value: "furniture", label: "Möbel" },
  { value: "object", label: "Objekt" },
  { value: "other", label: "Sonstiges" },
];

const MAP = Object.fromEntries(ART_TYPES.map((t) => [t.value, t.label]));

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
