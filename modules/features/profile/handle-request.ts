import { applicationOrigin } from "@platform/lib/application-origin";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { readProfile } from "./repositories/read-profile";
import { validateProfile } from "./validation";
export async function handleProfile(request?: Request) {
  return apiResponse(async () => {
    const { client, user } = await requireIdentity();
    if (!request) return Response.json(await readProfile(client, user));
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const profile = validateProfile(await readJson(request));
    if (!profile) throw new ApiError(400, "INVALID_INPUT");
    if (profile.email !== user.email) {
      const { error } = await client.auth.updateUser({ email: profile.email }, { emailRedirectTo: `${applicationOrigin()}/api/auth/callback` });
      if (error) throw new ApiError(400, "AUTH_FAILED");
    }
    const { error } = await client.from("profiles").upsert({ id: user.id, name: profile.name });
    if (error) throw new ApiError(503, "INTERNAL_ERROR");
    return Response.json({ name: profile.name, email: user.email, emailChangePending: profile.email !== user.email });
  });
}
