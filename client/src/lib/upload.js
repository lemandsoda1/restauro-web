import { upload } from "@vercel/blob/client";

/**
 * Upload File objects directly to Vercel Blob (browser → Blob, bypassing the
 * serverless request-body limit). Returns metadata to store with the request.
 * Tokens are issued by the server route /api/blob/upload.
 */
export async function uploadImages(files) {
  const results = [];
  for (const file of files) {
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
      contentType: file.type || undefined,
    });
    results.push({
      url: blob.url,
      originalName: file.name,
      mimeType: file.type || null,
      size: file.size,
    });
  }
  return results;
}
