import { readResource } from "@platform/features/resources/service";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiResponse(async () => {
    const resource = await readResource((await params).id);
    return new Response(resource.content, { headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource.id}.txt"`,
    } });
  });
}
