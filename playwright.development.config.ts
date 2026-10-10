import {defineConfig} from "@playwright/test";
export default defineConfig({testDir:"./tests",outputDir:"test-results-development",testMatch:"hydration-development.spec.ts",use:{baseURL:"http://localhost:3023",trace:"retain-on-failure"},webServer:{command:"npm run dev -- --port 3023",url:"http://localhost:3023",reuseExistingServer:false,timeout:120000}});
