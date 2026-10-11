import { expect, test } from "@playwright/test";
import { startCourse } from "../modules/features/learning/client/start-course";
import { setLessonCompletion } from "../modules/features/learning/client/complete-lesson";
import { httpRequest } from "../modules/lib/http-request";
import { readLearningResponse } from "../modules/helpers/read-learning-response";

test("R07 workflows order enrollment, progress and navigation and stop on failures", async () => {
  const calls: string[] = [];
  const enroll = async () => { calls.push("enroll"); };
  const navigation = { push: () => { calls.push("push"); }, refresh: () => { calls.push("refresh"); } };
  const model = { slug: "course", firstLesson: "lesson", enrolled: true, enroll, lessonHref: () => "/lesson", navigation };
  await startCourse(model);
  expect(calls).toEqual(["push"]);
  calls.length = 0;
  await startCourse({ ...model, enrolled: false });
  expect(calls).toEqual(["enroll", "push", "refresh"]);
  calls.length = 0;
  await expect(startCourse({ ...model, enrolled: false, enroll: async () => { throw new Error("FAIL"); } })).rejects.toThrow("FAIL");
  expect(calls).toEqual([]);
  const progress = async () => { calls.push("progress"); };
  await setLessonCompletion({ slug: "course", lessonId: "lesson", enrolled: false, completed: true, enroll, progress, refresh: navigation.refresh });
  expect(calls).toEqual(["enroll", "progress", "refresh"]);
  calls.length = 0;
  await expect(setLessonCompletion({ slug: "course", lessonId: "lesson", enrolled: true, completed: true, enroll, progress: async () => { throw new Error("FAIL"); }, refresh: navigation.refresh })).rejects.toThrow("FAIL");
  expect(calls).toEqual([]);
  await expect(setLessonCompletion({ slug: "course", lessonId: "lesson", enrolled: false, completed: true,
    enroll: async () => { throw new Error("ENROLL FAILED"); }, progress, refresh: navigation.refresh })).rejects.toThrow("ENROLL FAILED");
  expect(calls).toEqual([]);
});

test("R07 successful HTTP responses require decoding and transport allows cancellation/substitution", async () => {
  const signal = new AbortController().signal;
  let passedSignal: AbortSignal | null | undefined;
  const fetcher: typeof fetch = async (_input, init) => { passedSignal = init?.signal; return Response.json({ enrolled: [], completed: [], profile: { name: "Student", email: "student@example.com" } }); };
  const options = { path: "/custom", body: {}, failureLabel: "FAIL", decode: readLearningResponse, fetcher, signal };
  expect((await httpRequest(options)).profile.name).toBe("Student");
  expect(passedSignal).toBe(signal);
  await expect(httpRequest({ ...options, fetcher: async () => Response.json({ enrolled: "bad" }) })).rejects.toThrow("Invalid learning response");
  await expect(httpRequest({ ...options, fetcher: async () => Response.json({ error: "REJECTED" }, { status: 400 }) })).rejects.toThrow("REJECTED");
});

test("R07 completion locks the entire two-request workflow and allows retry after failure", async ({ page }) => {
  const calls: string[] = [];
  let release = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const state = { enrolled: ["first-client"], completed: [], profile: { name: "Student", email: "" } };
  await page.route("**/api/enrollments", async (route) => {
    calls.push("enroll");
    await gate;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(state) });
  });
  await page.route("**/api/progress", async (route) => {
    calls.push("progress");
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "TRY AGAIN" }) });
  });
  await page.goto("/learn/first-client/portfolio");
  const button = page.getByRole("button", { name: "أتممت هذا الدرس", exact: true });
  await button.evaluate((element) => { (element as HTMLButtonElement).click(); (element as HTMLButtonElement).click(); });
  await expect.poll(() => calls).toEqual(["enroll"]);
  await expect(page.getByRole("button", { name: "جارٍ الحفظ…", exact: true })).toBeDisabled();
  release();
  await expect(page.locator(".lms-error[role=alert]")).toHaveText("TRY AGAIN");
  expect(calls).toEqual(["enroll", "progress"]);
  await expect(button).toBeEnabled();
  await button.click();
  await expect.poll(() => calls.length).toBe(4);
});
