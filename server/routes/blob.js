import { Router } from "express";
import { handleUpload } from "@vercel/blob/client";

const router = Router();

/**
 * Resolve the Blob read-write token. Vercel normally exposes it as
 * BLOB_READ_WRITE_TOKEN, but a store created with a custom env-var prefix
 * (e.g. "Blob_images") names it Blob_images_READ_WRITE_TOKEN. Blob RW tokens
 * always start with "vercel_blob_rw_", so find it regardless of the var name.
 */
function resolveBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const value of Object.values(process.env)) {
    if (typeof value === "string" && value.startsWith("vercel_blob_rw_")) return value;
  }
  return undefined;
}

// POST /api/blob/upload — issues short-lived tokens so the browser can upload
// images directly to Vercel Blob (bypassing the serverless request-body limit).
router.post("/upload", async (req, res) => {
  const token = resolveBlobToken();
  // Also expose it under the standard name for any nested SDK calls.
  if (token && !process.env.BLOB_READ_WRITE_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = token;
  if (!token) {
    return res.status(500).json({ error: "Bild-Speicher ist nicht konfiguriert (kein Blob-Token gefunden)." });
  }
  try {
    const jsonResponse = await handleUpload({
      token,
      request: req,
      body: req.body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });
    res.json(jsonResponse);
  } catch (err) {
    res.status(400).json({ error: err?.message || "Upload fehlgeschlagen." });
  }
});

export default router;
