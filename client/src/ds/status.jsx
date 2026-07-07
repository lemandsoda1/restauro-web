/* Shared status vocabulary for requests & offers — German labels,
   Restauro badge tones, progress + stage mapping, and ref-id formatting. */
import { Badge } from "./index";

export const STATUS_LABELS = {
  new: "Neu",
  quoted: "Angebot erhalten",
  accepted: "Angenommen",
  in_progress: "In Bearbeitung",
  completed: "Abgeschlossen",
  declined: "Abgelehnt",
  pending: "Ausstehend",
};

const STATUS_TONE = {
  new: "info",
  quoted: "warning",
  accepted: "brand",
  in_progress: "success",
  completed: "brand",
  declined: "danger",
  pending: "warning",
};

const STATUS_DOT = { new: true, quoted: true, in_progress: true, pending: true };

const STATUS_PROGRESS = {
  new: 10, quoted: 30, accepted: 45, in_progress: 70, completed: 100, declined: 0,
};

export const STATUS_STAGE = {
  new: "Eingegangen",
  quoted: "Angebot erstellt",
  accepted: "Freigegeben",
  in_progress: "In Bearbeitung",
  completed: "Fertiggestellt",
  declined: "Abgelehnt",
};

export function statusProgress(status) {
  return STATUS_PROGRESS[status] ?? 0;
}

export function StatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONE[status] || "neutral"} dot={!!STATUS_DOT[status]}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

/* RST-YYYY-NNNN reference id from a request row */
export function refId(req) {
  if (!req) return "RST";
  const year = req.created_at ? new Date(req.created_at).getFullYear() : new Date().getFullYear();
  return `RST-${year}-${String(req.id).padStart(4, "0")}`;
}

/* Warm placeholder tone derived from id, for visual variety */
export function toneFor(id) {
  return (Number(id) || 0) % 3; // 0..2 keep light tones for artwork
}
