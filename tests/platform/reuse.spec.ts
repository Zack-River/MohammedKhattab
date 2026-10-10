import { expect, test } from "@playwright/test";
const fixtureUrl = process.env.REUSE_BASE_URL ?? "http://localhost:3043";
test("T22 profile normalization errors and mutation feedback prevent duplicate submission",async({page})=>{
 await page.goto(fixtureUrl);await expect(page.locator("html")).toHaveAttribute("data-fixture-ready","true");
 const form=page.locator('[data-profile=one] form');
 await form.locator('input[name=name]').fill("  ");
 await form.getByRole("button",{name:"SAVE",exact:true}).click();
 await expect(form.getByRole("alert")).toHaveText("INVALID");
 let requests=0;let release:()=>void=()=>{};const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route("**/api/profile",async route=>{requests++;await gate;await route.fulfill({status:400,contentType:"application/json",body:JSON.stringify({error:"SERVER VALIDATION"})});});
 await form.locator('input[name=name]').fill("Student");
 await form.evaluate(element=>{const target=element as HTMLFormElement;target.requestSubmit();target.requestSubmit();});
 await expect(form.getByRole("button",{name:"SAVING",exact:true})).toBeDisabled();
 await expect.poll(()=>requests).toBe(1);release();
 await expect(form.getByRole("alert")).toHaveText("SERVER VALIDATION");
 await expect(form.getByRole("button",{name:"SAVE",exact:true})).toBeEnabled();
});
test("T18 T20 alternate landing models own copy, sections and destinations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(fixtureUrl);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-ready","true");
  for (const name of ["Alpha", "Beta"]) {
    const scope = page.locator(`[data-fixture=${name.toLowerCase()}]`);
    await expect(scope.locator("h1")).toContainText(`${name}-heroLead`);
    await expect(
      scope.getByRole("link", {
        name: `${name}-heroBrowseAction`,
        exact: true,
      }),
    ).toHaveAttribute("href", `/${name}/browse`);
    await expect(scope.locator(".lms-brand").first()).toHaveAttribute(
      "href",
      `/${name}`,
    );
    await expect(
      scope.getByRole("link", { name: `${name}-start`, exact: true }),
    ).toHaveAttribute("href", `/${name}/start`);
    await expect(scope.locator(".lms-benefit-list > div")).toHaveCount(1);
    await expect(scope.locator("main > section")).toHaveCount(3);
    await expect(scope.locator("main > section").nth(1)).toHaveAttribute(
      "id",
      name,
    );
    await expect(scope.getByAltText(`${name}-PORTRAIT`)).toHaveAttribute("src","/assets/images/favicon.svg");
    await expect(scope.locator("[data-project-navigation]")).toHaveAttribute("aria-label", `${name}-PAGES`);
    await expect(scope.locator("[data-project-navigation] a")).toHaveAttribute("href", `/${name}/project`);
    expect(await scope.innerText()).not.toMatch(/Ta3llam|تعلّم|محمد خطاب/);
  }
});
test("T15 T19 independent controls and scoped same-key notes", async ({
  page,
}) => {
  await page.goto(fixtureUrl);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-ready","true");
  await page.locator("[data-notes=one] textarea").fill("SAME LEARNER NOTE");
  await expect(page.locator("[data-notes=same] textarea")).toHaveValue(
    "SAME LEARNER NOTE",
  );
  await expect(page.locator("[data-notes=other] textarea")).toHaveValue("");
  await page.locator("[data-notes=other] textarea").fill("OTHER NOTE");
  await page.reload();
  await expect(page.locator("[data-notes=one] textarea")).toHaveValue(
    "SAME LEARNER NOTE",
  );
  await expect(page.locator("[data-notes=other] textarea")).toHaveValue(
    "OTHER NOTE",
  );
  await page.locator("[data-profile=one] input[name=name]").fill("Changed One");
  await expect(page.locator("[data-profile=two] input[name=name]")).toHaveValue(
    "Two",
  );
  await page.locator("[data-faq=one] button").press("Enter");
  await expect(page.locator("[data-faq=one] button")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.locator("[data-faq=two] button")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  const ids = await page
    .locator("[id]")
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(
    await page
      .locator("label[for], [aria-controls]")
      .evaluateAll((elements) =>
        elements.every((element) =>
          Boolean(
            document.getElementById(
              element.getAttribute("for") ??
                element.getAttribute("aria-controls")!,
            ),
          ),
        ),
      ),
  ).toBe(true);
  await page.setViewportSize({ width: 390, height: 900 });
  const alpha = page.locator("[data-fixture=alpha] .lms-mobile-toggle");
  const beta = page.locator("[data-fixture=beta] .lms-mobile-toggle");
  await alpha.click();
  await expect(alpha).toHaveAttribute("aria-expanded", "true");
  await expect(beta).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(alpha).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Toggle controls" }).click();
  await expect(page.locator("[data-fixture=instances]")).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle controls" }).click();
  await expect(page.locator("[data-notes=one] textarea")).toHaveValue(
    "SAME LEARNER NOTE",
  );
});
test("T21 T23 minimal view models and layout variants render independently", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(fixtureUrl);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-ready","true");
  const narrow = page.locator("[data-fixture=narrow-models]");
  for (const text of [
    "ALT STAT",
    "ALT OUTLINE",
    "ALT RESOURCE",
    "ALT LEARNER",
    "ALT ISSUER",
  ])
    await expect(narrow).toContainText(text);
  await expect(narrow.locator("progress")).toHaveAttribute("value", "0");
  for (const layout of ["public", "dashboard"]) {
    const grid = page.locator(`[data-grid=${layout}]`);
    await expect(grid.locator(".lms-course-card")).toHaveCount(1);
    expect(
      await grid
        .locator(".lms-card-entrance")
        .evaluate((element) => element.getAnimations().length),
    ).toBe(0);
  }
  await expect(
    page.locator("[data-grid=dashboard] .lms-course-grid"),
  ).toHaveClass(/lms-dashboard-grid/);
});
test("T25 standalone section markers remain effective with alternate identifiers", async ({
  page,
}) => {
  await page.goto(fixtureUrl);
  await expect(page.locator("html")).toHaveAttribute("data-fixture-ready","true");
  const target = page
    .locator("[data-fixture=standalone] [data-reveal]")
    .first();
  await expect(target).toHaveAttribute("data-reveal", /^(true)?$/);
  await expect.poll(()=>target.evaluate(element=>element.getAnimations().length)).toBe(1);
  await target.evaluate((element) =>
    element.scrollIntoView({ behavior: "instant" }),
  );
  await expect
    .poll(() =>
      target.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
});
