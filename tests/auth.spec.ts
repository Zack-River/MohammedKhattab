import { test, expect, type Page } from "@playwright/test";
import { validateAuth } from "../modules/features/auth/helpers/validate";
import { authPolicy } from "../modules/config/auth";
import { authCopy } from "../modules/data/auth";
const demo = { name: "طالب التجربة", email: "student@example.com", password: "demo-pass-123", confirmPassword: "demo-pass-123" };
async function fill(page: Page, signup = false) {
  if (signup) await page.getByLabel("اسمك", { exact: true }).fill(demo.name);
  await page.getByLabel("البريد الإلكتروني", { exact: true }).fill(demo.email);
  await page.getByLabel("كلمة المرور", { exact: true }).fill(demo.password);
  if (signup) await page.getByLabel("تأكيد كلمة المرور", { exact: true }).fill(demo.confirmPassword);
}
test("shared validation normalizes identity, preserves passwords and rejects malformed values", () => {
  for (const input of [null, [], {}, { email: 123, password: false }]) expect(validateAuth(input, "login")).toEqual({ valid: false, errors: { email: "emailRequired", password: "passwordRequired" } });
  expect(validateAuth({}, "signup")).toEqual({ valid: false, errors: { name: "nameRequired", email: "emailRequired", password: "passwordRequired", confirmPassword: "confirmationRequired" } });
  const valid = validateAuth({ ...demo, name: ` ${demo.name} `, email: " STUDENT@EXAMPLE.COM ", password: " password ", confirmPassword: " password " }, "signup");
  expect(valid).toMatchObject({ valid: true, values: { name: demo.name, email: demo.email, password: " password " } });
  expect(validateAuth({ ...demo, name: "a", email: "invalid", password: "short", confirmPassword: "other" }, "signup")).toMatchObject({ valid: false, errors: { name: "nameLength", email: "emailInvalid", password: "passwordLength", confirmPassword: "confirmationMismatch" } });
  expect(validateAuth({ ...demo, name: "a".repeat(authPolicy.nameMax + 1), password: "a".repeat(authPolicy.passwordMax + 1) }, "signup")).toMatchObject({ valid: false, errors: { name: "nameLength", password: "passwordLength" } });
  expect(validateAuth({ email: demo.email, password: demo.password }, "login").valid).toBe(true);
});
test("auth APIs reject invalid payloads and cross-origin writes", async ({ request }) => {
  for (const path of ["login", "signup"]) {
    expect((await request.post(`/api/auth/${path}`, { data: "{broken", headers: { "Content-Type": "application/json" } })).status()).toBe(400);
    expect((await request.post(`/api/auth/${path}`, { data: demo, headers: { Origin: "https://other.example" } })).status()).toBe(403);
  }
  const invalid = await request.post("/api/auth/signup", { data: { ...demo, confirmPassword: "different" } });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toMatchObject({ fields: { confirmPassword: "confirmationMismatch" } });

});
test("signup errors, field focus, blur, confirmation and password visibility", async ({ page }) => {
  await page.goto("/ta3allam/signup");
  await page.getByRole("button", { name: "إنشاء حساب", exact: true }).click();
  const name = page.getByLabel("اسمك", { exact: true });
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText(authCopy.errors.nameRequired, { exact: true })).toBeVisible();
  await name.fill(demo.name);
  await name.press("Tab");
  await expect(name).toHaveAttribute("aria-invalid", "false");
  await fill(page, true);
  const password = page.getByLabel("كلمة المرور", { exact: true });
  await page.getByRole("button", { name: "إظهار كلمة المرور", exact: true }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "إخفاء كلمة المرور", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
  await page.getByLabel("تأكيد كلمة المرور", { exact: true }).fill("different");
  await page.getByRole("button", { name: "إنشاء حساب", exact: true }).click();
  await expect(page.getByText(authCopy.errors.confirmationMismatch, { exact: true })).toBeVisible();
  await page.getByLabel("تأكيد كلمة المرور", { exact: true }).fill(demo.password);
  await page.route("**/api/auth/signup", route => route.fulfill({ json: { status: "confirmation_required" } }));
  await page.getByRole("button", { name: "إنشاء حساب", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "راجع بريدك الإلكتروني" })).toBeVisible();
  await expect(page).toHaveURL(/\/ta3allam\/signup$/);
});
test("login provides pending feedback, recovers from errors and links to signup", async ({ page }) => {
  await page.goto("/ta3allam/login");
  await expect(page.locator(".lms-auth-form input")).toHaveCount(2);
  await expect(page.getByText(authCopy.errors.passwordRequired, { exact: true })).toHaveCount(0);
  await fill(page);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let calls = 0;
  await page.route("**/api/auth/login", async route => { calls++; await gate; await route.fulfill({ status: 503, json: { error: authCopy.requestError } }); });
  const submit = page.getByRole("button", { name: "تسجيل الدخول", exact: true });
  await submit.click();
  await expect(page.locator(".lms-auth-form button[type=submit]")).toBeDisabled();
  await expect(page.getByRole("status").filter({ hasText: "جارٍ المتابعة" })).toBeVisible();
  release();
  await expect(page.getByText(authCopy.requestError, { exact: true })).toBeVisible();
  expect(calls).toBe(1);
  await page.unroute("**/api/auth/login");
  await page.route("**/api/auth/login", route => route.fulfill({ status: 401, json: { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." } }));
  await submit.click();
  await expect(page.getByText("البريد الإلكتروني أو كلمة المرور غير صحيحة.", { exact: true })).toBeVisible();
  await page.goto("/ta3allam/login");
  await page.getByRole("link", { name: "أنشئ حسابًا", exact: true }).click();
  await expect(page).toHaveURL(/\/ta3allam\/signup$/);
  await page.getByRole("link", { name: "سجّل الدخول", exact: true }).click();
  await expect(page).toHaveURL(/\/ta3allam\/login$/);
});
for (const width of [320, 390, 768, 1440]) test(`auth layouts remain readable without overflow at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["login", "signup"]) {
    await page.goto(`/ta3allam/${route}`);
    await expect(page.locator(".lms-auth-card")).toBeVisible();
    await expect(page.locator(".lms-login-message .text-red")).toHaveCSS("color", "rgb(252, 53, 34)");
    await expect(page.locator(".lms-auth-card").getByText("حساب تعلّم", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel("كلمة المرور", { exact: true })).toHaveAttribute("autocomplete", route === "login" ? "current-password" : "new-password");
    if (width === 390 || width === 1440) await page.screenshot({ path: `docs/evidence/auth-screens/${route}-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});
for (const failure of ["network", "malformed"]) test(`login displays an Arabic retry message for ${failure} failures`, async ({ page }) => {
  await page.goto("/ta3allam/login");
  await fill(page);
  await page.route("**/api/auth/login", route => failure === "network" ? route.abort("failed") : route.fulfill({ status: 200, body: "not JSON", contentType: "application/json" }));
  await page.getByRole("button", { name: "تسجيل الدخول", exact: true }).click();
  await expect(page.getByText(authCopy.requestError, { exact: true })).toBeVisible();
  await expect(page.getByLabel("كلمة المرور", { exact: true })).toBeEnabled();
  await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("edited@example.com");
  await expect(page.getByText(authCopy.requestError, { exact: true })).toHaveCount(0);
});
