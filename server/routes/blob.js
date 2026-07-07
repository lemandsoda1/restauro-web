import { Router } from "express";
import { handleUpload } from "@vercel/blob/client";

const router = Router();

// POST /api/blob/upload — issues short-lived tokens so the browser can upload
// images directly to Vercel Blob (bypassing the serverless request-body limit).
// Public: the marketing site lets prospective clients upload before signing up.
router.post("/upload", async (req, res, next) => {
  try {
    const jsonResponse = await handleUpload({
      request: req,
      body: req.body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      // No-op: request rows are created by the /api/requests endpoints.
      onUploadCompleted: async () => {},
    });
    res.json(jsonResponse);
  } catch (err) {
    res.status(400).json({ error: err?.message || "Upload fehlgeschlagen." });
  }
});

export default router;
