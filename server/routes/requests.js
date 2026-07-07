import { Router } from "express";
import bcrypt from "bcryptjs";
import { sql } from "../db.js";
import { authenticate, signToken } from "../middleware/auth.js";

const router = Router();

/** Insert the uploaded image URLs for a request. `images` is [{url, originalName, mimeType, size}]. */
async function insertImages(requestId, images) {
  if (!Array.isArray(images)) return;
  for (const img of images) {
    if (!img?.url) continue;
    await sql`
      INSERT INTO request_images (request_id, url, original_name, mime_type, size_bytes)
      VALUES (${requestId}, ${img.url}, ${img.originalName || "Bild"}, ${img.mimeType || null}, ${img.size || null})`;
  }
}

// ── Client routes ────────────────────────────────────────────────────────────

// POST /api/requests — create a new restoration request (images already uploaded to Blob)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { title, description, art_type, images } = req.body;
    if (!title) return res.status(400).json({ error: "Titel ist erforderlich." });

    const inserted = await sql`
      INSERT INTO requests (client_id, title, description, art_type)
      VALUES (${req.user.id}, ${title}, ${description || null}, ${art_type || null})
      RETURNING id`;
    const requestId = inserted.rows[0].id;
    await insertImages(requestId, images);

    res.status(201).json({ id: requestId, message: "Anfrage erstellt." });
  } catch (err) { next(err); }
});

// POST /api/requests/guest — PUBLIC: create (or reuse) an account and a request in one step
router.post("/guest", async (req, res, next) => {
  try {
    const { title, description, art_type, name, email, password, phone, images } = req.body;
    if (!title) return res.status(400).json({ error: "Titel ist erforderlich." });
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, E-Mail und Passwort sind erforderlich." });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: "Das Passwort muss mindestens 6 Zeichen lang sein." });
    }

    const found = await sql`SELECT * FROM users WHERE email = ${email}`;
    const existing = found.rows[0];
    let userId;
    if (existing) {
      if (existing.role !== "client" || !bcrypt.compareSync(password, existing.password_hash)) {
        return res.status(409).json({
          error: "Diese E-Mail ist bereits registriert. Bitte melden Sie sich an, um fortzufahren.",
        });
      }
      userId = existing.id;
    } else {
      const hash = bcrypt.hashSync(password, 10);
      const created = await sql`
        INSERT INTO users (email, password_hash, name, phone)
        VALUES (${email}, ${hash}, ${name}, ${phone || null})
        RETURNING id`;
      userId = created.rows[0].id;
    }

    const inserted = await sql`
      INSERT INTO requests (client_id, title, description, art_type)
      VALUES (${userId}, ${title}, ${description || null}, ${art_type || null})
      RETURNING id`;
    const requestId = inserted.rows[0].id;
    await insertImages(requestId, images);

    const userRes = await sql`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
    const user = userRes.rows[0];
    res.status(201).json({ id: requestId, user, token: signToken(user), existingAccount: !!existing });
  } catch (err) { next(err); }
});

// GET /api/requests — list own requests
router.get("/", authenticate, async (req, res, next) => {
  try {
    const result = await sql`
      SELECT r.*,
             COUNT(ri.id)::int AS image_count,
             (SELECT o.price FROM offers o WHERE o.request_id = r.id ORDER BY o.created_at DESC LIMIT 1) AS latest_price,
             (SELECT o.status FROM offers o WHERE o.request_id = r.id ORDER BY o.created_at DESC LIMIT 1) AS offer_status
      FROM requests r
      LEFT JOIN request_images ri ON ri.request_id = r.id
      WHERE r.client_id = ${req.user.id}
      GROUP BY r.id
      ORDER BY r.created_at DESC`;
    res.json({ requests: result.rows });
  } catch (err) { next(err); }
});

// GET /api/requests/:id — single request with images + offers
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const reqRes = await sql`SELECT * FROM requests WHERE id = ${req.params.id} AND client_id = ${req.user.id}`;
    const request = reqRes.rows[0];
    if (!request) return res.status(404).json({ error: "Anfrage nicht gefunden." });

    const images = (await sql`SELECT * FROM request_images WHERE request_id = ${request.id} ORDER BY id`).rows;
    const offers = (await sql`SELECT * FROM offers WHERE request_id = ${request.id} ORDER BY created_at DESC`).rows;
    res.json({ request, images, offers });
  } catch (err) { next(err); }
});

export default router;
