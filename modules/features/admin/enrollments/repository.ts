import "server-only";
import { requireAdmin } from "../identity";
import { ApiError } from "@platform/lib/api/error";
import {readActorNames} from "../repositories/actor-names";
import { enrollmentPolicy } from "@platform/config/enrollment";
import type { EnrollmentChange, EnrollmentEvent } from "@platform/types/enrollment";
export async function manageEnrollment(userId: string, change: EnrollmentChange) {
 const {client} = await requireAdmin();
 const result = await client.rpc("manage_enrollment", {p_user:userId,p_slug:change.courseSlug,p_action:change.action,p_reason:change.reason,p_revision:change.revision});
 if (result.error) {
  const code = ["ENROLLMENT_CONFLICT","CONTACT_VERIFICATION_REQUIRED","FORBIDDEN","NOT_FOUND","INVALID_INPUT"].find(code => result.error!.message.includes(code));
  throw new ApiError(code === "ENROLLMENT_CONFLICT" ? 409 : code === "NOT_FOUND" ? 404 : code === "FORBIDDEN" || code === "CONTACT_VERIFICATION_REQUIRED" ? 403 : code ? 400 : 503,code ?? "INTERNAL_ERROR");
 }
 return {saved:true};
}
export async function readEnrollmentHistory(userId: string): Promise<EnrollmentEvent[]> {
 const {client} = await requireAdmin();
 const result = await client.from("enrollment_events").select("id,course_slug,action,reason,created_at,actor_id").eq("user_id",userId).order("created_at",{ascending:false}).order("id",{ascending:false}).limit(enrollmentPolicy.historyLimit);
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 const actors=await readActorNames(result.data.map(row=>row.actor_id));
 return result.data.map(row=>({...row,action:row.action as EnrollmentEvent["action"],actor:actors.get(row.actor_id??"")??""}));
}
