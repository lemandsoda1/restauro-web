// Local development / self-hosted entry. On Vercel the app is served by
// ../api/index.js instead (this file is not used there).

import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import app from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// Convenience for local production runs: serve the built client if present.
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => { if (err) next(); });
});

app.listen(PORT, () => {
  console.log(`\n  🎨 Restauro server running at http://localhost:${PORT}\n`);
});
