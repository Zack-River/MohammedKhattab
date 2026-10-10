import { workshopCourseConfig } from "../../config/workshop-course";
import { projectRoutes } from "../../config/project-navigation";
/** Public destinations are owned here; route filenames remain Next.js conventions. */
const segment = (value: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
    throw new Error(`Invalid route segment: ${value}`);
  return value;
};
export const sectionIds = {
  courses: "courses",
  coaching: "coaching",
  instructor: "instructor",
  faq: "faq",
  steps: "how-it-works",
  enrollment: "course-enrollment",
} as const;
export const routes = {
  home: projectRoutes.learning,
  portfolio: projectRoutes.portfolio,
  workshop: projectRoutes.workshop,
  courses: `${projectRoutes.learning}/courses`,
  dashboard: `${projectRoutes.learning}/dashboard`,
  login: `${projectRoutes.learning}/login`,
  signup: `${projectRoutes.learning}/signup`,
  library: `${projectRoutes.learning}/dashboard/courses`,
  resources: `${projectRoutes.learning}/dashboard/resources`,
  certificates: `${projectRoutes.learning}/dashboard/certificates`,
  profile: `${projectRoutes.learning}/dashboard/profile`,
  admin: `${projectRoutes.learning}/dashboard/admin/courses`,
  adminCourse: (slug: string) => `${routes.admin}/${segment(slug)}`,
  course: (slug: string) => slug === workshopCourseConfig.slug ? projectRoutes.workshop : `${projectRoutes.learning}/courses/${segment(slug)}`,
  lesson: (slug: string, id: string) =>
    `${projectRoutes.learning}/learn/${segment(slug)}/${segment(id)}`,
  enrollment: (slug: string) =>
    slug === workshopCourseConfig.slug ? projectRoutes.workshop : `${routes.course(slug)}#${sectionIds.enrollment}`,
  section: (id: keyof typeof sectionIds) => `${projectRoutes.learning}#${sectionIds[id]}`,
  catalog: (query = "", category = "all") => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    return routes.courses + (params.size ? `?${params}` : "");
  },
};
export const endpoints = {
  auth: { login: "/api/auth/login", signup: "/api/auth/signup", logout: "/api/auth/logout", session: "/api/auth/session" },
  adminCourse: (slug: string) => `/api/admin/courses/${segment(slug)}`,
  adminLesson: (slug: string, id: string) => `${endpoints.adminCourse(slug)}/lessons/${segment(id)}`,
  courses: "/api/courses",
  enrollments: "/api/enrollments",
  progress: "/api/progress",
  profile: "/api/profile",
  introStream: (slug: string) => `/api/courses/${segment(slug)}/intro`,
  lessonStream: (slug: string, id: string) => `/api/courses/${segment(slug)}/lessons/${segment(id)}/stream`,
  course: (slug: string) => `/api/courses/${segment(slug)}`,
  resource: (id: string) => `/api/resources/${segment(id)}`,
  certificate: (slug: string) => `/api/certificates/${segment(slug)}`,
};
