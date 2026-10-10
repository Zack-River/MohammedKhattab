import { courseProgress } from "./course-progress";
import type { Course, LearningState } from "@platform/types/lms";
export interface DashboardStatsOptions {
  state: LearningState;
  courses: readonly Course[];
  labels: { enrolledCourses: string; completedLessons: string; completedCourses: string };
}
export function dashboardStats({ state, courses, labels }: DashboardStatsOptions) {
  return [
    {
      label: labels.enrolledCourses,
      value: new Set(state.enrolled).size,
      symbol: "book" as const,
    },
    {
      label: labels.completedLessons,
      value: new Set(state.completed).size,
      symbol: "check" as const,
    },
    {
      label: labels.completedCourses,
      value: courses.filter(
        (course) => courseProgress(course, state).percent === 100,
      ).length,
      symbol: "award" as const,
    },
  ];
}
