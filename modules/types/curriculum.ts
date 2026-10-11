import type { Course, CourseModule } from "./lms";
import type { curriculumCopy } from "@platform/data/curriculum";
export type CurriculumLabels = { [K in keyof typeof curriculumCopy]: string };
export type CurriculumKind = "chapter" | "section" | "lesson";
export type CurriculumOperation = "create" | "edit" | "delete";
export interface CurriculumTarget { kind: CurriculumKind; operation: CurriculumOperation; id?: string; chapterId?: string; sourceChapterId?: string; sectionId?: string; }
export interface CurriculumMutation extends CurriculumTarget { revision: number; title?: string; description?: string; durationSeconds?: number; videoUrl?: string; preview?: boolean; }
export type CurriculumChapter = CourseModule & { id: string };
export type CurriculumCourse = Omit<Course,"modules"> & { modules: CurriculumChapter[] };
export interface CurriculumContext { course: CurriculumCourse; revision: number; videos: Record<string,string>; labels: CurriculumLabels; }
