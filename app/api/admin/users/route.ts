import { apiResponse } from "@platform/lib/api/respond";
import { readAdminUsers } from "@platform/features/admin/repositories/users";
import { readAdminPage } from "@platform/features/admin/helpers/read-admin-page";
export async function GET(request: Request) {
  return apiResponse(async () => Response.json(await readAdminUsers(readAdminPage(new URL(request.url).searchParams.get("page")))));
}
