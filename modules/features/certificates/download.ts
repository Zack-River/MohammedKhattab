import {requireIdentity} from "@platform/features/auth/server/identity";
import {ApiError} from "@platform/lib/api/error";
import {certificateSvg,certificateResponse} from "./document";
import {learningIdentity} from "@/config/identity";
export async function readStudentCertificate(slug:string) {
 const {client,user}=await requireIdentity();
 const result=await client.from("certificates").select("*").eq("course_slug",slug).eq("user_id",user.id).maybeSingle();
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 if(!result.data) throw new ApiError(403,"CERTIFICATE_INELIGIBLE");
 if(result.data.status==="revoked") throw new ApiError(403,"CERTIFICATE_REVOKED");
 const [course,enrollment]=await Promise.all([client.from("courses").select("slug").eq("slug",slug).eq("published",true).maybeSingle(),client.from("enrollment_access").select("active").eq("user_id",user.id).eq("course_slug",slug).eq("active",true).maybeSingle()]);
 if(course.error||enrollment.error) throw new ApiError(503,"INTERNAL_ERROR");
 if(!course.data||!enrollment.data) throw new ApiError(403,"FORBIDDEN");
 return result.data;
}

export async function downloadCertificate(slug:string,inline=false) {
 const record=await readStudentCertificate(slug);return certificateResponse(certificateSvg(record),`${learningIdentity.exportPrefix}-${slug}`,inline);
}
