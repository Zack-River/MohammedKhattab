import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { validateSettings } from "./helpers/validate-settings";
import { readAccount } from "./repositories/read-account";
import { saveSettings } from "./repositories/save-settings";
export function handleSettings(request?: Request) {
  return apiResponse(async () => {
    if (!request) return Response.json(await readAccount());
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const input = validateSettings(await readJson(request));
    if (!input) throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await saveSettings(input));
  });
}
