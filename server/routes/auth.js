import { Router } from "express";
import bcrypt from "bcryptjs";
import { sql } from "../db.js";
import { authenticate, signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "E-Mail, Passwort und Name sind erforderlich." });
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Diese E-Mail ist bereits registriert." });
    }
    const hash = bcrypt.hashSync(password, 10);
    const inserted = await sql`
      INSERT INTO users (email, password_hash, name, phone)
      VALUES (${email}, ${hash}, ${name}, ${phone || null})
      RETURNING id`;

    const user = { id: inserted.rows[0].id, email, name, role: "client" };
    res.status(201).json({ user, token: signToken(user) });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich." });
    }
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const row = result.rows[0];
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: "E-Mail oder Passwort ist ungültig." });
    }
    const user = { id: row.id, email: row.email, name: row.name, role: row.role };
    res.json({ user, token: signToken(user) });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const result = await sql`
      SELECT id, email, name, phone, address, role, created_at
      FROM users WHERE id = ${req.user.id}`;
    if (result.rows.length === 0) return res.status(404).json({ error: "Benutzer nicht gefunden." });
    res.json({ user: result.rows[0] });
  } catch (err) { next(err); }
});

export default router;
