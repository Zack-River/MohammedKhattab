import {webkit} from "@playwright/test";
import {dirname,join} from "node:path";
const webkitBundle=join(dirname(webkit.executablePath()),"minibrowser-wpe");
const temporaryWebkit=process.env.KHATAB_BROWSER_LIBS?{executablePath:join(webkitBundle,"bin/MiniBrowser"),env:{...process.env,LD_LIBRARY_PATH:`${webkitBundle}/lib:${webkitBundle}/sys/lib:${process.env.KHATAB_BROWSER_LIBS}`,WEBKIT_EXEC_PATH:`${webkitBundle}/bin`,WEBKIT_INJECTED_BUNDLE_PATH:`${webkitBundle}/lib`,WEBKIT_INSPECTOR_RESOURCES_PATH:`${webkitBundle}/share`}}:{};
import {defineConfig} from "@playwright/test";
export default defineConfig({testDir:"./tests/platform",testMatch:"lms.spec.ts",grep:/catalog filters|enrollment and progress|deferred video|demo entry|mobile navigation and FAQ/,workers:1,retries:0,outputDir:"test-results-crossbrowser",use:{baseURL:process.env.TEST_BASE_URL??"http://localhost:3040",trace:"retain-on-failure"},projects:[{name:"chromium",use:{browserName:"chromium"}},{name:"firefox",use:{browserName:"firefox"}},{name:"webkit",use:{browserName:"webkit",launchOptions:temporaryWebkit}}]});
