import type { enrollmentPolicy } from "@platform/config/enrollment";
import type { enrollmentCopy } from "@platform/data/enrollment";
export type EnrollmentAction = typeof enrollmentPolicy.actions[number];
export type EnrollmentChange = { courseSlug: string; action: EnrollmentAction; reason: string; revision: number };
export type EnrollmentLabels = typeof enrollmentCopy;
export type EnrollmentEvent = { id: number; course_slug: string; action: EnrollmentAction; reason: string; created_at: string; actor: string };
