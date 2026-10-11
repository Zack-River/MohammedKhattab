import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { cloudinaryRequest } from "@platform/lib/cloudinary/request";
import { ApiError } from "@platform/lib/api/error";
import type { UploadedImage } from "@platform/types/image-upload";
export async function saveAvatar(userId: string, image: UploadedImage) {
  const { error, data } = await createAuthAdministrator().from("profiles").update({ avatar_url: image.url }).eq("id", userId).select("id").single();
  if (error || !data) {
    await cloudinaryRequest("destroy", { public_id: image.publicId, invalidate: "true" }).catch(() => null);
    throw new ApiError(503, "INTERNAL_ERROR");
  }
}
