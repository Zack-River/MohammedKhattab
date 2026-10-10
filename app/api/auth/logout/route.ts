import { createDatabaseClient } from "@platform/lib/supabase/server";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { sameOrigin } from "@platform/lib/server-request";
export async function POST(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const client = await createDatabaseClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new ApiError(503, "AUTH_FAILED");
    return Response.json({ status: "signed_out" });
  });
}
