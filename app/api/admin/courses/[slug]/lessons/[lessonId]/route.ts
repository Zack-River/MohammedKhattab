import { handleAdminLesson } from "@platform/features/admin/handle-lesson";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  return handleAdminLesson(slug,lessonId,request);
}
