import { isValidUsername, normalizeUsername } from "../helpers/validation/username";
import { workshopCourseConfig } from "../../config/workshop-course";
import { projectRoutes } from "../../config/project-navigation";
/** Public destinations are owned here; route filenames remain Next.js conventions. */
const learningBase = projectRoutes.learning === "/" ? "" : projectRoutes.learning;
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
  payment: (id: string) => `/payments/${segment(id)}`,
  checkout: (slug: string) => `/checkout/${segment(slug)}`,
  home: projectRoutes.learning,
  portfolio: projectRoutes.portfolio,
  workshop: projectRoutes.workshop,
  courses: projectRoutes.courses,
  dashboard: `${learningBase}/dashboard`,
  login: `${learningBase}/login`,
  signup: `${learningBase}/signup`,
  forgotPassword: `${learningBase}/forgot-password`,
  confirmEmail: `${learningBase}/confirm-email`,
  resetPassword: `${learningBase}/reset-password`,
  library: `${learningBase}/dashboard/courses`,
  resources: `${learningBase}/dashboard/resources`,
  certificates: `${learningBase}/dashboard/certificates`,
  profile: `${learningBase}/dashboard/profile`,
  settings: `${learningBase}/dashboard/settings`,
  admin: "/admin/dashboard/courses",
  adminDashboard: "/admin/dashboard",
  adminProfile: "/admin/dashboard/profile",
  adminSettings: "/admin/dashboard/settings",
  adminUsers: "/admin/dashboard/users",
  adminPhoneConfirmations: "/admin/dashboard/phone-confirmations",
  adminUser: (username: string) => {
    if (!isValidUsername(username)) throw new Error("Invalid username route");
    return `/admin/dashboard/users/${normalizeUsername(username)}`;
  },
  adminCourseCreate: "/admin/dashboard/courses/new",
  adminCourseContent: (slug: string) => `/admin/dashboard/courses/${segment(slug)}/content`,
  adminCourse: (slug: string) => `${routes.admin}/${segment(slug)}`,
  workshopPage: (slug: string) => `/workshops/${segment(slug)}`,
  course: (slug: string, delivery?: "recorded" | "live") => delivery === "live" || slug === workshopCourseConfig.slug ? routes.workshopPage(slug) : `${learningBase}/courses/${segment(slug)}`,
  lesson: (slug: string, id: string) =>
    `${learningBase}/learn/${segment(slug)}/${segment(id)}`,
  enrollment: (slug: string, delivery?: "recorded" | "live") =>
    delivery === "live" || slug === workshopCourseConfig.slug ? routes.workshopPage(slug) : `${routes.course(slug)}#${sectionIds.enrollment}`,
  section: (id: keyof typeof sectionIds) => `${projectRoutes.learning}#${sectionIds[id]}`,
  catalog: (query = "", category = "all") => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    return routes.courses + (params.size ? `?${params}` : "");
  },
};
export const endpoints = {
  paymentCheckout: "/api/payments/checkout",
  paymentStatus: (id: string) => `/api/payments/${segment(id)}`,
  paymentReconcile: (id: string) => `${endpoints.paymentStatus(id)}/reconcile`,
  adminCourses: "/api/admin/courses",
  adminCourseDelete: (slug: string) => `${endpoints.adminCourse(slug)}/delete`,
  imageUpload: "/api/media/images",
  adminAnalytics: "/api/admin/analytics",
  adminUsers: "/api/admin/users",
  adminUser: (id: string) => `/api/admin/users/${segment(id)}`,
  auth: { login: "/api/auth/login", signup: "/api/auth/signup", logout: "/api/auth/logout", session: "/api/auth/session" },
  adminCourse: (slug: string) => `/api/admin/courses/${segment(slug)}`,
  adminMediaStream: (slug: string, url: string) => `${endpoints.adminCourse(slug)}/media/stream?url=${encodeURIComponent(url)}`,
  adminCurriculum: (slug: string) => `/api/admin/courses/${segment(slug)}/content`,
  adminLesson: (slug: string, id: string) => `${endpoints.adminCourse(slug)}/lessons/${segment(id)}`,
  courses: "/api/courses",
  enrollments: "/api/enrollments",
  progress: "/api/progress",
  profile: "/api/profile",
  accountSettings: "/api/account/settings",
  accountPassword: "/api/account/password",
  emailConfirmation: "/api/account/verification",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  contactVerification: (id: string) => `${endpoints.adminUser(id)}/verification`,
  introStream: (slug: string) => `/api/courses/${segment(slug)}/intro`,
  lessonStream: (slug: string, id: string) => `/api/courses/${segment(slug)}/lessons/${segment(id)}/stream`,
  course: (slug: string) => `/api/courses/${segment(slug)}`,
  resource: (id: string) => `/api/resources/${segment(id)}`,
  certificate: (slug: string) => `/api/certificates/${segment(slug)}`,
};
