import type { courseSorts, courseStatuses, courseDeliveries } from "@platform/config/course-administration";
import type { Category } from "@platform/types/lms";
import type { adminCoursesCopy } from "@platform/data/admin-courses";
export type AdminCoursesLabels = { [K in keyof typeof adminCoursesCopy]: string };
export interface AdminCourseQuery { page: number; search: string; category: Category; statuses: typeof courseStatuses[number][]; delivery: typeof courseDeliveries[number]; sort: typeof courseSorts[number]; direction: "asc" | "desc"; }
export interface AdminCourseRow { slug: string; title: string; category: Exclude<Category,"all">; delivery: "recorded" | "live"; published: boolean; createdAt: string | null; updatedAt: string | null; students: number; lessons: number; chapters: number; sections: number; }
export interface AdminCourseResults { courses: AdminCourseRow[]; page: number; total: number; hasNext: boolean; }
export interface CreateCourseInput { slug: string; title: string; description: string; amount: number; category: Exclude<Category,"all">; delivery: "recorded" | "live"; }
