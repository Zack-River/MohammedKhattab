import "server-only";
import { createHash } from "node:crypto";
import { cloudinaryEnvironment } from "./environment";
import { imageUploadPolicy } from "@platform/config/image-upload";
import { ApiError } from "@platform/lib/api/error";
export async function cloudinaryRequest(action: "upload" | "destroy", parameters: Record<string, string>, file?: File, fetcher = fetch) {
  const { cloudName, apiKey, secret } = cloudinaryEnvironment();
  const values = { ...parameters, timestamp: String(Math.floor(Date.now() / 1000)) };
  const signature = createHash("sha256").update(Object.entries(values).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&") + secret).digest("hex");
  const body = new FormData();
  for (const [key, value] of Object.entries(values)) body.set(key, value);
  body.set("signature", signature); body.set("api_key", apiKey);
  if (file) body.set("file", file, "image");
  const response = await fetcher(`https://api.cloudinary.com/v1_1/${cloudName}/image/${action}`, { method: "POST", body, signal: AbortSignal.timeout(imageUploadPolicy.timeoutMs) }).catch(() => { throw new ApiError(503, "IMAGE_STORAGE_UNAVAILABLE"); });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok || !data || typeof data !== "object") throw new ApiError(503, "IMAGE_STORAGE_UNAVAILABLE");
  return data as Record<string, unknown>;
}
