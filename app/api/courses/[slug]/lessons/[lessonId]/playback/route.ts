import { readPlayback } from "@platform/features/catalog/repositories/read-playback";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  return apiResponse(async () => {
    const { slug, lessonId } = await params;
    return Response.json({ videoUrl: await readPlayback(slug, lessonId) });
  });
}
