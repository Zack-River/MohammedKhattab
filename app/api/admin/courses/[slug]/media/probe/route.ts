import { handleAdminMediaProbe } from "@platform/features/admin/handle-media-probe";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return handleAdminMediaProbe((await params).slug, request);
}
