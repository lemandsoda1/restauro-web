// Cloudflare Turnstile — Spamschutz für Registrierung und Gast-Anfrage.
//
// Bewusst NICHT am Login: die native Mac-App meldet sich über /api/auth/login an
// und kann kein Browser-Widget lösen. Würde man den Login schützen, käme das
// Personal nicht mehr in die App.
//
// Der Browser schickt das Token aus dem Turnstile-Widget als `turnstileToken`
// im JSON-Body mit; hier wird es bei Cloudflare geprüft. Ist TURNSTILE_SECRET_KEY
// nicht gesetzt, ist der Schutz ausgeschaltet und die Anfrage läuft unverändert
// durch (lokale Entwicklung, bevor ein Cloudflare-Konto eingerichtet ist).

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(req, res, next) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return next();

  const token = req.body?.turnstileToken;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Bitte bestätigen Sie den Spamschutz und versuchen Sie es erneut." });
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip;
    if (ip) params.set("remoteip", ip);

    const r = await fetch(VERIFY_URL, { method: "POST", body: params, signal: AbortSignal.timeout(5000) });
    const data = await r.json();
    if (data.success) return next();

    return res.status(400).json({ error: "Spamschutz fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut." });
  } catch (err) {
    // Fail closed: lieber kurz nicht anmelden/registrieren als Spam durchlassen.
    console.error("Turnstile-Prüfung nicht möglich:", err);
    return res.status(503).json({ error: "Der Spamschutz ist gerade nicht erreichbar. Bitte versuchen Sie es in einem Moment erneut." });
  }
}
