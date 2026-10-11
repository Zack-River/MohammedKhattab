import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "./identity";
import { readModeration, validUserId } from "./helpers/read-moderation";
import { moderateUser } from "./repositories/moderate-user";
import { readAdminUser } from "./repositories/users";
import { readUserSubscriptions } from "./repositories/user-subscriptions";
export async function handleAdminUser(id: string, request?: Request) {
  return apiResponse(async () => {
    await requireAdmin();
    if (!validUserId(id)) throw new ApiError(400, "INVALID_INPUT");
    if (!request) return Response.json({ user: await readAdminUser(id), subscriptions: await readUserSubscriptions(id) });
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const change = readModeration(await readJson(request));
    if (!change) throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await moderateUser(id, change));
  });
}
