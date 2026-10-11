import { workshopCourseConfig } from "./workshop-course";
export const projectRoutes = {
  portfolio: "/founder",
  learning: "/",
  workshop: `/workshops/${workshopCourseConfig.slug}`,
} as const;
export const projectNavigation = {
  label: "صفحات محمد خطاب",
  links: [
    { href: projectRoutes.portfolio, label: "محمد خطاب" },
    { href: projectRoutes.learning, label: "تعلّم" },
  ],
};

/** Former platform namespaces retained as compatibility redirects. */
export const legacyLearningNamespaces = ["ta3allam", "ta3llam"] as const;
