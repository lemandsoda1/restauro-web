import { Router } from "express";
import { put } from "@vercel/blob";
import { sql } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function blobToken() {
  const clean = (v) => (typeof v === "string" ? v.trim().replace(/^["']|["']$/g, "").trim() : "");
  const pref = clean(process.env.BLOB_READ_WRITE_TOKEN);
  if (pref.startsWith("vercel_blob_rw_")) return pref;
  for (const v of Object.values(process.env)) {
    const t = clean(v);
    if (t.startsWith("vercel_blob_rw_")) return t;
  }
  return undefined;
}

// ── Public: site content + published reference works ─────────────────────────
router.get("/content", async (_req, res, next) => {
  try {
    const c = await sql`SELECT value FROM content WHERE key = 'site'`;
    const w = await sql`SELECT id, title, artist, meta, status_label, image_url
                        FROM works WHERE published = TRUE
                        ORDER BY sort_order ASC, created_at DESC`;
    res.json({ content: c.rows[0]?.value ?? null, works: w.rows });
  } catch (err) { next(err); }
});

// ── Admin: read/write the content document ───────────────────────────────────
router.get("/admin/content", requireAdmin, async (_req, res, next) => {
  try {
    const c = await sql`SELECT value FROM content WHERE key = 'site'`;
    res.json({ content: c.rows[0]?.value ?? {} });
  } catch (err) { next(err); }
});

router.patch("/admin/content", requireAdmin, async (req, res, next) => {
  try {
    const value = req.body?.content ?? {};
    await sql`
      INSERT INTO content (key, value, updated_at) VALUES ('site', ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
    res.json({ message: "Inhalte gespeichert." });
  } catch (err) { next(err); }
});

// ── Admin: reference works CRUD ──────────────────────────────────────────────
router.get("/admin/works", requireAdmin, async (_req, res, next) => {
  try {
    const w = await sql`SELECT * FROM works ORDER BY sort_order ASC, created_at DESC`;
    res.json({ works: w.rows });
  } catch (err) { next(err); }
});

router.post("/admin/works", requireAdmin, async (req, res, next) => {
  try {
    const { title, artist, meta, status_label, image_url, sort_order, published } = req.body;
    if (!title) return res.status(400).json({ error: "Titel ist erforderlich." });
    const r = await sql`
      INSERT INTO works (title, artist, meta, status_label, image_url, sort_order, published)
      VALUES (${title}, ${artist || null}, ${meta || null}, ${status_label || null},
              ${image_url || null}, ${sort_order ?? 0}, ${published ?? true})
      RETURNING *`;
    res.status(201).json({ work: r.rows[0] });
  } catch (err) { next(err); }
});

router.patch("/admin/works/:id", requireAdmin, async (req, res, next) => {
  try {
    const f = await sql`SELECT * FROM works WHERE id = ${req.params.id}`;
    const w = f.rows[0];
    if (!w) return res.status(404).json({ error: "Eintrag nicht gefunden." });
    const b = req.body;
    await sql`
      UPDATE works SET
        title = ${b.title ?? w.title},
        artist = ${b.artist ?? w.artist},
        meta = ${b.meta ?? w.meta},
        status_label = ${b.status_label ?? w.status_label},
        image_url = ${b.image_url ?? w.image_url},
        sort_order = ${b.sort_order ?? w.sort_order},
        published = ${b.published ?? w.published}
      WHERE id = ${req.params.id}`;
    res.json({ message: "Eintrag aktualisiert." });
  } catch (err) { next(err); }
});

router.delete("/admin/works/:id", requireAdmin, async (req, res, next) => {
  try {
    await sql`DELETE FROM works WHERE id = ${req.params.id}`;
    res.json({ message: "Eintrag entfernt." });
  } catch (err) { next(err); }
});

// ── Admin: upload an image (base64) to Blob, return its public URL ────────────
// Used by the native Mac app, which can't do the browser client-upload flow.
router.post("/admin/upload", requireAdmin, async (req, res, next) => {
  try {
    const { filename, dataBase64, contentType } = req.body;
    if (!dataBase64) return res.status(400).json({ error: "Kein Bild übermittelt." });
    const token = blobToken();
    if (!token) return res.status(500).json({ error: "Bild-Speicher nicht konfiguriert." });
    const buffer = Buffer.from(dataBase64, "base64");
    const blob = await put(`works/${filename || "bild"}`, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: contentType || "image/jpeg",
      token,
    });
    res.status(201).json({ url: blob.url });
  } catch (err) { next(err); }
});

export default router;
