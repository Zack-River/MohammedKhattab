import { handleCourseDelete } from "@platform/features/admin/handle-course-delete";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) { return handleCourseDelete((await params).slug, request); }
