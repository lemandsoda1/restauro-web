import { useEffect, useRef, useState } from "react";

/* Cloudflare Turnstile — unsichtbarer Spamschutz für Login, Registrierung und
   Gast-Anfrage. Der Site Key kommt aus VITE_TURNSTILE_SITE_KEY (Vercel →
   Environment Variables). Ist er nicht gesetzt, ist der Schutz aus: das Widget
   rendert nichts und die Formulare funktionieren wie bisher. */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
export const turnstileEnabled = Boolean(SITE_KEY);

let scriptPromise;
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => { scriptPromise = null; reject(new Error("Turnstile konnte nicht geladen werden.")); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

function Widget({ onToken }) {
  const box = useRef(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    let widgetId;
    let cancelled = false;
    loadScript()
      .then((ts) => {
        if (cancelled || !box.current) return;
        widgetId = ts.render(box.current, {
          sitekey: SITE_KEY,
          language: "de",
          theme: "light",
          appearance: "interaction-only", // nur sichtbar, wenn Cloudflare eine Rückfrage braucht
          callback: (t) => cb.current(t),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => cb.current(""));
    return () => {
      cancelled = true;
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  return <div ref={box} />;
}

/* Hook für die Formulare:
     const captcha = useTurnstile();
     … {captcha.widget} …                       // im Formular platzieren
     captcha.getToken()                          // beim Absenden (immer das aktuelle Token)
     captcha.reset()                             // nach einem fehlgeschlagenen Versuch — Tokens sind einmalig */
export function useTurnstile() {
  const tokenRef = useRef("");
  const [key, setKey] = useState(0);
  return {
    enabled: turnstileEnabled,
    widget: turnstileEnabled ? <Widget key={key} onToken={(t) => { tokenRef.current = t; }} /> : null,
    getToken: () => tokenRef.current,
    reset: () => { tokenRef.current = ""; setKey((k) => k + 1); },
  };
}

export const CAPTCHA_PENDING = "Der Spamschutz wird noch geprüft — bitte einen Moment warten und erneut absenden.";
