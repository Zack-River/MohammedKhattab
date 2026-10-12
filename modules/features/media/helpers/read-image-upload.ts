import { securityPolicy } from "@platform/config/security";
import { imageUploadPolicy as policy } from "@platform/config/image-upload";
import { readRequestBytes } from "@platform/lib/read-request-bytes";
import { ApiError } from "@platform/lib/api/error";
export async function readImageUpload(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new ApiError(400, "INVALID_IMAGE");
  const bytes = await readRequestBytes(request, policy.maxRequestBytes, securityPolicy.uploadBodyTimeoutMs);
  if (!bytes) throw new ApiError(413, "IMAGE_TOO_LARGE");
  const form = await new Response(new Blob([Uint8Array.from(bytes).buffer]), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData().catch(() => null);
  const file = form?.get("file"), kind = form?.get("kind"), courseSlug = form?.get("courseSlug");
  if (!(file instanceof File) || !file.size || !["avatar", "course"].includes(String(kind))) throw new ApiError(400, "INVALID_IMAGE");
  if (file.size > policy.maxBytes) throw new ApiError(413, "IMAGE_TOO_LARGE");
  if (kind === "course" && (typeof courseSlug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(courseSlug))) throw new ApiError(400, "INVALID_INPUT");
  return { file, kind: kind as "avatar" | "course", courseSlug: typeof courseSlug === "string" ? courseSlug : "" };
}
