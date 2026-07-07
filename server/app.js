// Express app (routes + middleware only) — shared by local dev (index.js)
// and the Vercel serverless entry (../api/index.js). No server.listen here.

import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import requestRoutes from "./routes/requests.js";
import adminRoutes from "./routes/admin.js";
import offerRoutes from "./routes/offers.js";
import blobRoutes from "./routes/blob.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Ensure the schema exists before serving any API request (idempotent, cached).
app.use(async (_req, _res, next) => {
  try { await initDB(); next(); } catch (err) { next(err); }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blob", blobRoutes);
app.use("/api", offerRoutes);

// JSON error handler so failures never leak an HTML stack trace to the SPA.
app.use((err, _req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Serverfehler." });
});

export default app;
