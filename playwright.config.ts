import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  testIgnore: ["**/hydration-development.spec.ts", "**/fixtures/**"],
  webServer: {
    command: "node node_modules/next/dist/bin/next start tests/platform/fixtures/reuse --port 3043",
    url: process.env.REUSE_BASE_URL ?? "http://localhost:3043",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    { name: "site", testDir: "./tests", testIgnore: ["**/platform/**", "**/hydration-development.spec.ts", "**/fixtures/**"] },
    { name: "platform", testDir: "./tests/platform" },
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL ?? "http://localhost:3040",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
});
