import type { Course } from "./lms";
import type { ImageUploadLabels } from "./image-upload";
import type { adminCopy } from "@platform/data/admin";
export type CourseEditorLabels = { [K in keyof typeof adminCopy]: string };
export interface CourseEditorProps {
  course: Course;
  published: boolean;
  revision: number;
  labels: CourseEditorLabels;
  categories: readonly { id: string; label: string }[];
  uploadLabels: ImageUploadLabels;
}
