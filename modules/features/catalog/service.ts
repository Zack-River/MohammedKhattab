import "server-only";
import { cache } from "react";
import { readCourses } from "./repositories/read-courses";
const catalog = cache(readCourses);
export async function listCourses(query = "", category = "all") {
  const q = query.trim().toLocaleLowerCase("ar");
  return (await catalog()).filter((course) =>
    (category === "all" || course.category === category) && (!q ||
      `${course.title} ${course.subtitle} ${course.description} ${course.tool}`.toLocaleLowerCase("ar").includes(q)));
}
export async function findCourse(slug: string) { return (await catalog()).find((course) => course.slug === slug); }
