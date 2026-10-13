import { enrollmentPolicy } from "@platform/config/enrollment";
import { validRecordRevision } from "@platform/helpers/valid-record-revision";
import type { EnrollmentChange } from "@platform/types/enrollment";
export function validateEnrollment(value: unknown): EnrollmentChange | null {
 if (!value || typeof value !== "object") return null;
 const v = value as Record<string, unknown>;
 if (typeof v.courseSlug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.courseSlug) || v.courseSlug.length > 100
 || !enrollmentPolicy.actions.some(action => action === v.action) || typeof v.reason !== "string"
 || !v.reason.trim() || v.reason.length > enrollmentPolicy.reasonMax || !validRecordRevision(v.revision, false)) return null;
 return {courseSlug:v.courseSlug,action:v.action as EnrollmentChange["action"],reason:v.reason.trim(),revision:Number(v.revision)};
}
