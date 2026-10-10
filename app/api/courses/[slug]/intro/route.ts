import { findCourse } from "@platform/features/catalog/service";
import { streamDrive } from "@platform/features/catalog/stream-drive";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return apiResponse(async () => {
    const course = await findCourse((await params).slug);
    if (!course?.introVideoUrl) throw new ApiError(404,"NOT_FOUND");
    return streamDrive(course.introVideoUrl,request);
  });
}
