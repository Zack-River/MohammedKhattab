import { requireIdentity } from "@platform/features/auth/server/identity";
import { readProfile } from "@platform/features/profile/repositories/read-profile";
import { apiResponse } from "@platform/lib/api/respond";
export async function GET() {
  return apiResponse(async () => {
    const { client, user } = await requireIdentity();
    return Response.json({ status: "authenticated", profile: await readProfile(client, user) });
  });
}
