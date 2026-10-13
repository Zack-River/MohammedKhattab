import { securityHeaders, privateRedirectHeaders } from "./modules/lib/security/headers";
import { workshopCourseConfig } from "./config/workshop-course";
import type { NextConfig } from "next";
import { projectRoutes, legacyLearningNamespaces } from "./config/project-navigation";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  experimental: { proxyClientMaxBodySize: "4mb" },
  async headers() { return [{ source: "/:path*", headers: securityHeaders }, { source: "/api/resources/:id", headers: privateRedirectHeaders }]; },
  async redirects() {
    return [
      { source: `/${workshopCourseConfig.slug}`, destination: projectRoutes.workshop, permanent: true },
      ...legacyLearningNamespaces.flatMap((namespace) => [
        { source: `/${namespace}/${workshopCourseConfig.slug}`, destination: projectRoutes.workshop, permanent: true },
        { source: `/${namespace}/courses/${workshopCourseConfig.slug}`, destination: projectRoutes.workshop, permanent: true },
        { source: `/${namespace}`, destination: projectRoutes.learning, permanent: true },
        { source: `/${namespace}/:path+`, destination: "/:path+", permanent: true },
      ]),
      { source: "/portfolio", destination: projectRoutes.portfolio, permanent: false },
      { source: "/workshop", destination: projectRoutes.workshop, permanent: false },
    ];
  },
};

export default nextConfig;
