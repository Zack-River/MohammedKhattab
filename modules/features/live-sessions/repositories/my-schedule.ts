import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { readLiveSchedule } from "./schedule";
export async function readMyLiveSchedule() {
 const {client}=await requireIdentity();
 const result=await client.from("enrollment_access").select("course_slug").eq("active",true);
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return readLiveSchedule(result.data.flatMap(row=>row.course_slug ? [row.course_slug] : []));
}
