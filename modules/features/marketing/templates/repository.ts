import "server-only";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { requireAdmin } from "@platform/features/admin/identity";
import { ApiError } from "@platform/lib/api/error";
import { defaultWorkshopTemplate } from "./default-template";
import { validateWorkshopTemplate } from "./helpers/validate-document";
import type { Course } from "@platform/types/lms";
import type { TemplateRecord, WorkshopTemplate } from "@platform/types/workshop-template";
import type { Json } from "@platform/types/database";
export async function readWorkshopTemplate(course:Course):Promise<TemplateRecord> {
 const client=await createDatabaseClient();
 const {data,error}=await client.from('workshop_templates').select('document,revision').eq('course_slug',course.slug).maybeSingle();
 if(error) throw new ApiError(503,'INTERNAL_ERROR');
 const fallback=defaultWorkshopTemplate(course);
 return {document:data && validateWorkshopTemplate(data.document,fallback) ? data.document : fallback, revision:data?.revision ?? 0};
}
export async function saveWorkshopTemplate(slug:string,document:WorkshopTemplate,revision:number) {
 const {client}=await requireAdmin();
 const values={document:JSON.parse(JSON.stringify(document)) as NonNullable<Json>,revision:revision+1,updated_at:new Date().toISOString()};
 const result=revision===0 ? await client.from('workshop_templates').insert({...values,course_slug:slug}).select('revision').single() : await client.from('workshop_templates').update(values).eq('course_slug',slug).eq('revision',revision).select('revision').maybeSingle();
 if(result.error?.code==='23505' || !result.error && !result.data) throw new ApiError(409,'COURSE_CONFLICT');
 if(result.error) throw new ApiError(503,'INTERNAL_ERROR');
 return {saved:true,revision:result.data!.revision};
}
