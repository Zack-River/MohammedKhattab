import { handleAdminCurriculum } from "@platform/features/admin/handle-curriculum";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return handleAdminCurriculum((await params).slug,request);
}
