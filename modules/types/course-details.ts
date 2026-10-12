import type { Course } from "./lms";
import type { ImageAsset } from "@khatab/design/types/ui";
import type { ContentBindings } from "./content";
export type CourseDetailsLabels = { [K in keyof typeof import("@platform/data/course-details").courseDetailsCopy]: string };
export interface CourseDetailsProps {
  course: Course; enrolled: boolean; nextLesson?: string;
  labels: CourseDetailsLabels;
  copy: Pick<ContentBindings["copy"], "error" | "saving" | "continue" | "enrollLabel" | "outcome">;
  instructor: { name: string; tagline: string; image: ImageAsset; href: string };
  site: { englishName: string }; priceLabel: string; breadcrumbLabel: string;
  supportHref: string;
}
