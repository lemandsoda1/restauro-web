# Westermeier Restaurierung — Web

Two-sided art-restoration platform: a marketing site + a guest "request a quote"
flow, a client portal (track requests, approve offers), and an admin area for the
studio (review requests, step-by-step quoting, shipping/logistics, client archive).

- **Frontend:** React + Vite + React Router (`client/`)
- **Backend:** Express serverless API (`server/`, entry `api/index.js`)
- **Database:** Vercel Postgres (Neon)
- **Image storage:** Vercel Blob (browser uploads directly to Blob)

---

## Deploy to Vercel

1. **Push this folder to GitHub** as its own repository (it already has a git repo — just add a remote and push; see below).

2. **Import the repo in Vercel** → *Add New… → Project*. Vercel reads `vercel.json`
   (build command, output dir, and the `/api` rewrite), so no framework preset is needed.

3. **Add storage to the project** (Vercel dashboard → *Storage*):
   - **Postgres** → creates and injects `POSTGRES_URL` automatically.
   - **Blob** → creates and injects `BLOB_READ_WRITE_TOKEN` automatically.

4. **Add environment variables** (Project → *Settings → Environment Variables*):
   - `JWT_SECRET` — a long random string.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the first admin account (seeded on first run).

5. **Deploy.** On first request the API creates the tables and seeds the admin.
   Verify with `https://<your-app>.vercel.app/api/health` → `{"ok":true}`, then log in
   at `/login` and open `/admin`.

### Optional: Cloudflare Turnstile (Spamschutz)

Registrierung und die Gast-Anfrage (`/api/auth/register`, `/api/requests/guest`) können durch
ein unsichtbares Cloudflare-Turnstile-Widget geschützt werden. Ohne Schlüssel ist der Schutz
aus und alles funktioniert wie bisher. Der Login ist bewusst ausgenommen: die native Mac-App
meldet sich über `/api/auth/login` an und kann kein Browser-Widget lösen.

1. Cloudflare Dashboard → *Turnstile* → *Add widget*; Hostnames eintragen
   (`<your-app>.vercel.app`, später die eigene Domain, zum Testen `localhost`), Modus *Managed*.
2. In Vercel → *Settings → Environment Variables* (Production + Preview):
   - `VITE_TURNSTILE_SITE_KEY` = Site Key (öffentlich)
   - `TURNSTILE_SECRET_KEY` = Secret Key (geheim)
3. **Neu deployen** — der Site Key wird beim Build in den Client eingebettet.

Lokal testen ohne Konto: Cloudflares Testschlüssel (`1x00000000000000000000AA` /
`1x0000000000000000000000000000000AA`) bestehen immer, `2x0000000000000000000000000000000AA`
als Secret scheitert immer. Code: `server/middleware/turnstile.js`,
`client/src/components/Turnstile.jsx`.

The database and uploaded photos persist in Vercel Postgres/Blob (not on the
function filesystem), so everything survives across deployments and cold starts.

---

## Local development

Requires a Postgres connection string and a Blob token (create a free Neon DB and a
Vercel Blob store, or run `vercel env pull server/.env` after linking the project).

```bash
cp .env.example server/.env      # fill in POSTGRES_URL, BLOB_READ_WRITE_TOKEN, JWT_SECRET
npm install                      # root (server deps) + resolves for api/
npm install --prefix client      # client deps
npm run dev                      # server on :3001, client on :5173 (proxied)
```

Open http://localhost:5173.

---

## Push to GitHub

```bash
git remote add origin https://github.com/<you>/restauro-web.git
git branch -M main
git push -u origin main
```
# restauro-web
