export const projectRoutes = {
  portfolio: "/",
  learning: "/ta3allam",
  workshop: "/7days-freelance",
} as const;
export const projectNavigation = {
  label: "صفحات محمد خطاب",
  links: [
    { href: projectRoutes.portfolio, label: "محمد خطاب" },
    { href: projectRoutes.learning, label: "تعلّم" },
    { href: projectRoutes.workshop, label: "ورشة التغيير" },
  ],
};

/** Former top-level learning routes retained as redirects. */
export const legacyLearningSections = ["courses", "dashboard", "learn", "login"] as const;
