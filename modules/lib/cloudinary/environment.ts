import "server-only";
import { ApiError } from "@platform/lib/api/error";
export function cloudinaryEnvironment() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME, apiKey = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret || !/^[a-z0-9_-]+$/i.test(cloudName)) throw new ApiError(503, "IMAGE_STORAGE_UNAVAILABLE");
  const environment = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "development");
  if (!["production", "preview", "development", "test"].includes(environment)) throw new ApiError(503, "IMAGE_STORAGE_UNAVAILABLE");
  return { cloudName, apiKey, secret, root: `ta3allam/${environment}` };
}
