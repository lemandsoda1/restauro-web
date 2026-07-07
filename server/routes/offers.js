import { Router } from "express";
import { sql } from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/admin/requests/:id/offers — admin creates an offer
router.post("/admin/requests/:id/offers", requireAdmin, async (req, res, next) => {
  try {
    const { price, currency, description, estimated_days } = req.body;
    if (price == null || price <= 0) {
      return res.status(400).json({ error: "Ein gültiger Preis ist erforderlich." });
    }
    const found = await sql`SELECT id FROM requests WHERE id = ${req.params.id}`;
    if (found.rows.length === 0) return res.status(404).json({ error: "Anfrage nicht gefunden." });

    const inserted = await sql`
      INSERT INTO offers (request_id, price, currency, description, estimated_days)
      VALUES (${req.params.id}, ${price}, ${currency || "EUR"}, ${description || null}, ${estimated_days || null})
      RETURNING id`;

    await sql`UPDATE requests SET status = 'quoted', updated_at = NOW() WHERE id = ${req.params.id}`;
    res.status(201).json({ id: inserted.rows[0].id, message: "Angebot erstellt." });
  } catch (err) { next(err); }
});

// PATCH /api/offers/:id/respond — client accepts or declines
router.patch("/offers/:id/respond", authenticate, async (req, res, next) => {
  try {
    const { action } = req.body;
    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ error: "Aktion muss 'accept' oder 'decline' sein." });
    }
    const offerRes = await sql`SELECT * FROM offers WHERE id = ${req.params.id}`;
    const offer = offerRes.rows[0];
    if (!offer) return res.status(404).json({ error: "Angebot nicht gefunden." });

    const ownRes = await sql`SELECT id FROM requests WHERE id = ${offer.request_id} AND client_id = ${req.user.id}`;
    if (ownRes.rows.length === 0) return res.status(403).json({ error: "Dies ist nicht Ihre Anfrage." });

    if (offer.status !== "pending") {
      return res.status(400).json({ error: "Auf dieses Angebot wurde bereits geantwortet." });
    }

    const newStatus = action === "accept" ? "accepted" : "declined";
    await sql`UPDATE offers SET status = ${newStatus}, responded_at = NOW() WHERE id = ${offer.id}`;
    await sql`UPDATE requests SET status = ${newStatus}, updated_at = NOW() WHERE id = ${offer.request_id}`;
    res.json({ message: `Angebot ${newStatus}` });
  } catch (err) { next(err); }
});

export default router;
