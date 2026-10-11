import type { UploadedImage } from "@platform/types/image-upload";
import { ApiError } from "@platform/lib/api/error";
export function readUploadedImage(input: unknown): UploadedImage {
  const value = input as Partial<UploadedImage> | null;
  if (!value || typeof value.url !== "string" || !value.url.startsWith("https://res.cloudinary.com/") || typeof value.publicId !== "string" || typeof value.width !== "number" || typeof value.height !== "number" || !Number.isFinite(value.width) || !Number.isFinite(value.height) || value.width <= 0 || value.height <= 0) throw new ApiError(503, "IMAGE_STORAGE_UNAVAILABLE");
  return value as UploadedImage;
}
