import { downloadCertificate } from "@platform/features/certificates/download";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return apiResponse(async () => downloadCertificate((await params).slug));
}
