import { readPlayback } from "@platform/features/catalog/repositories/read-playback";
import { streamDrive } from "@platform/features/catalog/stream-drive";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET(request: Request, { params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  return apiResponse(async () => { const { slug, lessonId } = await params; return streamDrive(await readPlayback(slug,lessonId),request); });
}
