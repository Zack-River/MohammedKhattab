import { courseAdministration } from "@platform/config/course-administration";
export function formatCourseDate(value: string | null, fallback: string) {
 return value ? new Intl.DateTimeFormat(courseAdministration.locale, { timeZone: courseAdministration.timezone, year: "numeric", month: "short", day: "numeric" }).format(new Date(value)) : fallback;
}
