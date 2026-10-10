import { listCourses } from "@platform/features/catalog";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET(request: Request) {
  return apiResponse(async () => {
    const params = new URL(request.url).searchParams;
    return Response.json({ courses: await listCourses(params.get("q") ?? "", params.get("category") ?? "all") });
  });
}
