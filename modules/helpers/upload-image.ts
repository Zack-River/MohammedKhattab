import { endpoints } from "@platform/config/navigation";
import { imageUploadPolicy } from "@platform/config/image-upload";
import { readUploadedImage } from "@platform/features/media/helpers/read-uploaded-image";
import type { ImageUploadTarget } from "@platform/types/image-upload";
export async function uploadImageFile(file: File, target: ImageUploadTarget, failureLabel: string) {
  if (!file.size || file.size > imageUploadPolicy.maxBytes || !imageUploadPolicy.accept.split(",").includes(file.type)) throw new Error(failureLabel);
  const body = new FormData(); body.set("file", file); body.set("kind", target.kind);
  if (target.kind === "course") body.set("courseSlug", target.courseSlug);
  const response = await fetch(endpoints.imageUpload, { method: "POST", body }).catch(() => { throw new Error(failureLabel); });
  const value: unknown = await response.json().catch(() => { throw new Error(failureLabel); });
  if (!response.ok) throw new Error(value && typeof value === "object" && "error" in value && typeof value.error === "string" ? value.error : failureLabel);
  return readUploadedImage(value);
}
