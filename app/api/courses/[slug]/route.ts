import { findCourse } from "@platform/features/catalog";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return apiResponse(async () => {
    const course = await findCourse((await params).slug);
    if (!course) throw new ApiError(404, "NOT_FOUND");
    return Response.json(course);
  });
}
