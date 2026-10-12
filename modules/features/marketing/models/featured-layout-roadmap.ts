import type { Course } from "@platform/types/lms";
import type { RoadmapContent } from "@khatab/design/types/marketing";
import { numbered } from "@platform/features/catalog/helpers/numbered";
import { courseDetailsCopy } from "@platform/data/course-details";
export function featuredLayoutRoadmap(content: RoadmapContent, course: Course, referenceSlug: string): RoadmapContent {
  if (course.slug === referenceSlug) return content;
  return { ...content, heading: { title: [courseDetailsCopy.content], description: [course.modules.length ? course.description : courseDetailsCopy.upcomingContent] },
    formula: { title: courseDetailsCopy.about, inputs: course.outcomes, result: course.title },
    days: course.modules.map((chapter,index) => ({ number: numbered(index), label: courseDetailsCopy.chapters, title: chapter.title,
      type: course.deliveryLabel || (course.delivery === "live" ? courseDetailsCopy.live : courseDetailsCopy.recorded), kind: "lesson", lessons: chapter.lessons.map(lesson => lesson.title) })),
  };
}
