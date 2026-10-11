import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { sameOrigin } from "@platform/lib/server-request";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { requireAdmin } from "@platform/features/admin/identity";
import { readImageUpload } from "./helpers/read-image-upload";
import { validateImage } from "./helpers/validate-image";
import { uploadImage } from "./repositories/upload-image";
import { saveAvatar } from "./repositories/save-avatar";
export function handleImageUpload(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const { user } = await requireIdentity(), input = await readImageUpload(request);
    if (input.kind === "course") {
      const { client } = await requireAdmin();
      const course = await client.from("courses").select("slug").eq("slug", input.courseSlug).maybeSingle();
      if (course.error) throw new ApiError(503, "INTERNAL_ERROR");
      if (!course.data) throw new ApiError(404, "NOT_FOUND");
    }
    await validateImage(input.file);
    const folder = input.kind === "avatar" ? `users/${user.id}/avatars` : `courses/${input.courseSlug}/thumbnails`;
    const image = await uploadImage(input.file, folder, input.kind === "avatar");
    if (input.kind === "avatar") await saveAvatar(user.id, image);
    return Response.json(image, { status: 201 });
  });
}
