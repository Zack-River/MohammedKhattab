import { apiResponse } from "@platform/lib/api/respond";
import { readAdminUsers } from "@platform/features/admin/repositories/users";
import { readUserQuery } from "@platform/features/admin/helpers/read-user-query";
export async function GET(request: Request) {
  return apiResponse(async () => Response.json(await readAdminUsers(readUserQuery(new URL(request.url).searchParams))));
}
