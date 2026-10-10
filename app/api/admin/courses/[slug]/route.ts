import { handleAdminCourse } from "@platform/features/admin/handle-course";
type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) { return handleAdminCourse((await params).slug); }
export async function POST(request: Request, { params }: Context) { return handleAdminCourse((await params).slug, request); }
