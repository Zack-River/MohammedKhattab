import type { NextConfig } from "next";
import { projectRoutes, legacyLearningSections } from "./config/project-navigation";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  async redirects() {
    return [
      { source: "/ta3llam/:path*", destination: `${projectRoutes.learning}/:path*`, permanent: false },
      ...legacyLearningSections.map((section) => ({
        source: `/${section}/:path*`,
        destination: `${projectRoutes.learning}/${section}/:path*`,
        permanent: false,
      })),
      { source: "/portfolio", destination: projectRoutes.portfolio, permanent: false },
      { source: "/workshop", destination: projectRoutes.workshop, permanent: false },
    ];
  },
};

export default nextConfig;
