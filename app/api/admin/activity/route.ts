import {readAdminActivity} from "@platform/features/admin/repositories/activity";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {activityEntities} from "@platform/config/materials";
import {apiResponse} from "@platform/lib/api/respond";
export function GET(request:Request) {
 return apiResponse(async()=>Response.json(await readAdminActivity(readRecordQuery(Object.fromEntries(new URL(request.url).searchParams),activityEntities))));
}
