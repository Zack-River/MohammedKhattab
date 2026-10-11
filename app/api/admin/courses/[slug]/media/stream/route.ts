import { handleAdminMediaStream } from "@platform/features/admin/handle-media-stream";
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return handleAdminMediaStream((await params).slug, request);
}
