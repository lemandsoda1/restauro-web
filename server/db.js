// ── Postgres data layer (Vercel Postgres / Neon) ─────────────────────────────
// Uses @vercel/postgres. Reads the connection string from POSTGRES_URL.
// Schema creation + admin seeding are idempotent and run once per process.

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

let readyPromise;

/** Ensure schema + seed exist. Idempotent; cached per process. */
export function initDB() {
  if (!readyPromise) readyPromise = migrate();
  return readyPromise;
}

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name          TEXT NOT NULL,
      phone         TEXT,
      address       TEXT,
      role          TEXT NOT NULL DEFAULT 'client',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

  await sql`
    CREATE TABLE IF NOT EXISTS requests (
      id              SERIAL PRIMARY KEY,
      client_id       INTEGER NOT NULL REFERENCES users(id),
      title           TEXT NOT NULL,
      description     TEXT,
      art_type        TEXT,
      status          TEXT NOT NULL DEFAULT 'new',
      shipping_status TEXT NOT NULL DEFAULT 'pending',
      shipping_notes  TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

  await sql`
    CREATE TABLE IF NOT EXISTS request_images (
      id            SERIAL PRIMARY KEY,
      request_id    INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
      url           TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type     TEXT,
      size_bytes    INTEGER,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      id             SERIAL PRIMARY KEY,
      request_id     INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
      price          DOUBLE PRECISION NOT NULL,
      currency       TEXT NOT NULL DEFAULT 'EUR',
      description    TEXT,
      estimated_days INTEGER,
      status         TEXT NOT NULL DEFAULT 'pending',
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      responded_at   TIMESTAMPTZ
    );`;

  // Migrations for pre-existing databases (safe if columns already present).
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`;
  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS shipping_status TEXT NOT NULL DEFAULT 'pending';`;
  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS shipping_notes TEXT;`;

  // Seed an initial admin (override via ADMIN_EMAIL / ADMIN_PASSWORD env).
  const adminEmail = process.env.ADMIN_EMAIL || "admin@restauro.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
  if (existing.rows.length === 0) {
    const hash = bcrypt.hashSync(adminPassword, 10);
    await sql`INSERT INTO users (email, password_hash, name, role)
              VALUES (${adminEmail}, ${hash}, 'Admin', 'admin')`;
    console.log(`✓ Admin user seeded: ${adminEmail}`);
  }
}

export { sql };
