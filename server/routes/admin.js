import { Router } from "express";
import { sql } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/admin/requests — list all requests
router.get("/requests", requireAdmin, async (_req, res, next) => {
  try {
    const result = await sql`
      SELECT r.*,
             u.name  AS client_name,
             u.email AS client_email,
             u.phone AS client_phone,
             u.address AS client_address,
             COUNT(ri.id)::int AS image_count,
             (SELECT o.price FROM offers o WHERE o.request_id = r.id ORDER BY o.created_at DESC LIMIT 1) AS latest_price,
             (SELECT o.status FROM offers o WHERE o.request_id = r.id ORDER BY o.created_at DESC LIMIT 1) AS offer_status
      FROM requests r
      JOIN users u ON u.id = r.client_id
      LEFT JOIN request_images ri ON ri.request_id = r.id
      GROUP BY r.id, u.name, u.email, u.phone, u.address
      ORDER BY r.created_at DESC`;
    res.json({ requests: result.rows });
  } catch (err) { next(err); }
});

// GET /api/admin/requests/:id — single request with everything
router.get("/requests/:id", requireAdmin, async (req, res, next) => {
  try {
    const reqRes = await sql`
      SELECT r.*, u.name AS client_name, u.email AS client_email,
             u.phone AS client_phone, u.address AS client_address
      FROM requests r JOIN users u ON u.id = r.client_id
      WHERE r.id = ${req.params.id}`;
    const request = reqRes.rows[0];
    if (!request) return res.status(404).json({ error: "Anfrage nicht gefunden." });

    const images = (await sql`SELECT * FROM request_images WHERE request_id = ${request.id} ORDER BY id`).rows;
    const offers = (await sql`SELECT * FROM offers WHERE request_id = ${request.id} ORDER BY created_at DESC`).rows;
    res.json({ request, images, offers });
  } catch (err) { next(err); }
});

// PATCH /api/admin/requests/:id/status
router.patch("/requests/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ["new", "quoted", "accepted", "in_progress", "completed", "declined"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `Status muss einer der folgenden sein: ${valid.join(", ")}` });
    }
    const found = await sql`SELECT id FROM requests WHERE id = ${req.params.id}`;
    if (found.rows.length === 0) return res.status(404).json({ error: "Anfrage nicht gefunden." });

    await sql`UPDATE requests SET status = ${status}, updated_at = NOW() WHERE id = ${req.params.id}`;
    res.json({ message: `Status aktualisiert auf '${status}'.` });
  } catch (err) { next(err); }
});

// PATCH /api/admin/requests/:id/shipping
router.patch("/requests/:id/shipping", requireAdmin, async (req, res, next) => {
  try {
    const { shipping_status, shipping_notes } = req.body;
    const valid = ["pending", "pickup_scheduled", "in_transit", "at_studio", "returned"];
    if (shipping_status != null && !valid.includes(shipping_status)) {
      return res.status(400).json({ error: `Versandstatus muss einer der folgenden sein: ${valid.join(", ")}` });
    }
    const found = await sql`SELECT * FROM requests WHERE id = ${req.params.id}`;
    const r = found.rows[0];
    if (!r) return res.status(404).json({ error: "Anfrage nicht gefunden." });

    await sql`
      UPDATE requests
      SET shipping_status = ${shipping_status ?? r.shipping_status},
          shipping_notes  = ${shipping_notes ?? r.shipping_notes},
          updated_at = NOW()
      WHERE id = ${req.params.id}`;
    res.json({ message: "Versanddaten aktualisiert." });
  } catch (err) { next(err); }
});

// GET /api/admin/clients — all clients with project counts (archive)
router.get("/clients", requireAdmin, async (_req, res, next) => {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.phone, u.address, u.created_at,
             COUNT(r.id)::int AS request_count,
             COALESCE(SUM(CASE WHEN r.status IN ('new','quoted','accepted','in_progress') THEN 1 ELSE 0 END), 0)::int AS active_count,
             MAX(r.created_at) AS last_request_at
      FROM users u
      LEFT JOIN requests r ON r.client_id = u.id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.created_at DESC`;
    res.json({ clients: result.rows });
  } catch (err) { next(err); }
});

// PATCH /api/admin/clients/:id — update a client's contact details
router.patch("/clients/:id", requireAdmin, async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const found = await sql`SELECT * FROM users WHERE id = ${req.params.id} AND role = 'client'`;
    const u = found.rows[0];
    if (!u) return res.status(404).json({ error: "Kunde nicht gefunden." });

    await sql`
      UPDATE users
      SET name = ${name ?? u.name}, phone = ${phone ?? u.phone}, address = ${address ?? u.address}
      WHERE id = ${req.params.id}`;
    res.json({ message: "Kundendaten aktualisiert." });
  } catch (err) { next(err); }
});

// GET /api/admin/stats — dashboard stats
router.get("/stats", requireAdmin, async (_req, res, next) => {
  try {
    const total = (await sql`SELECT COUNT(*)::int AS count FROM requests`).rows[0].count;
    const byStatus = (await sql`SELECT status, COUNT(*)::int AS count FROM requests GROUP BY status`).rows;
    const recent = (await sql`
      SELECT r.id, r.title, r.status, r.created_at, u.name AS client_name
      FROM requests r JOIN users u ON u.id = r.client_id
      ORDER BY r.created_at DESC LIMIT 5`).rows;
    res.json({ total, byStatus, recent });
  } catch (err) { next(err); }
});

export default router;
