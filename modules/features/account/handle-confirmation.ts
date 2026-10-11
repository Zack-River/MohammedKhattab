import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "@platform/features/admin/identity";
import { validUserId } from "@platform/features/admin/helpers/read-moderation";
import { readUserContacts } from "./repositories/read-user-contacts";
export function handleConfirmation(request: Request, id: string) {
  return apiResponse(async () => {
    const { client } = await requireAdmin();
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    if (!validUserId(id)) throw new ApiError(404, "NOT_FOUND");
    const input = await readJson(request);
    if (!input || input.field !== "phone" || typeof input.value !== "string") throw new ApiError(400, "INVALID_INPUT");
    const contact = await readUserContacts(id), value = contact.phone_e164;
    if (!value || input.value !== value) throw new ApiError(409, "CONTACT_CHANGED");
    const { error } = await client.rpc("confirm_account_contact", { p_user_id: id, p_field: input.field, p_value: value });
    if (error) throw new ApiError(error.code === "40001" ? 409 : 503, error.code === "40001" ? "CONTACT_CHANGED" : "INTERNAL_ERROR");
    return Response.json({ confirmed: true });
  });
}
