import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Metadata reads the canonical palette from this source file.
  outputFileTracingIncludes: { "/*": ["./app/styles/theme.css"] },
};

export default nextConfig;
