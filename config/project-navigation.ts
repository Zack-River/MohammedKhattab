import { workshopCourseConfig } from "./workshop-course";
export const projectRoutes = {
  portfolio: "/founder",
  learning: "/",
  courses: "/courses",
  workshop: `/workshops/${workshopCourseConfig.slug}`,
} as const;
export const projectNavigation = {
  label: "صفحات محمد خطاب",
  links: [
    { href: projectRoutes.portfolio, label: "محمد خطاب" },
    { href: projectRoutes.learning, label: "تعلّم" },
  ],
};

export const portfolioPlatformNavigation = [
  ...projectNavigation.links.filter(link => link.href === projectRoutes.learning),
  { href: projectRoutes.courses, label: "كورساتي" },
];

/** Former platform namespaces retained as compatibility redirects. */
export const legacyLearningNamespaces = ["ta3allam", "ta3llam"] as const;
