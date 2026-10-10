import { expect, test } from "@playwright/test";
import { offerConfig } from "../app/config/offer";
import { splitCountdown } from "../app/lib/countdown";

test("countdown splits day boundaries and stops at zero", () => {
  expect(splitCountdown(86400)).toEqual({
    days: "01",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  expect(splitCountdown(-1)).toEqual({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
});

test("reference countdown ticks and keeps its deadline after refreshing", async ({
  page,
}) => {
  const now = new Date("2026-10-03T10:00:00Z");
  const remaining = 3 * 86400 + 19 * 3600 + 27 * 60 + 13;
  await page.clock.setFixedTime(now);
  await page.addInitScript(
    ({ key, deadline }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, String(deadline));
    },
    { key: offerConfig.storageKey, deadline: now.getTime() + remaining * 1000 },
  );
  await page.goto("/7days-freelance");
  const timer = page.getByRole("timer");
  await expect(
    page.getByText("ينتهي الخصم خلال :", { exact: true }),
  ).toBeVisible();
  await expect(timer.locator('[data-countdown-unit="days"]')).toHaveText("03");
  await expect(timer.locator('[data-countdown-unit="hours"]')).toHaveText("19");
  await expect(timer.locator('[data-countdown-unit="minutes"]')).toHaveText(
    "27",
  );
  await expect(timer.locator('[data-countdown-unit="seconds"]')).toHaveText(
    "13",
  );
  await page.clock.setFixedTime(new Date(now.getTime() + 1000));
  await expect(timer.locator('[data-countdown-unit="seconds"]')).toHaveText(
    "12",
  );
  const deadline = await page.evaluate(
    (key) => localStorage.getItem(key),
    offerConfig.storageKey,
  );
  await page.reload();
  await expect(timer.locator('[data-countdown-unit="seconds"]')).toHaveText(
    "12",
  );
  expect(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      offerConfig.storageKey,
    ),
  ).toBe(deadline);
});

test("expired discount stays expired and blocked storage does not crash", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "1"),
    offerConfig.storageKey,
  );
  await page.goto("/7days-freelance");
  await expect(page.locator('[data-countdown-unit="days"]')).toHaveText("00");
  await expect(page.locator('[data-countdown-unit="seconds"]')).toHaveText(
    "00",
  );
  await page.reload();
  await expect(page.locator('[data-countdown-unit="days"]')).toHaveText("00");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    }),
  );
  await page.reload();
  await expect(page.getByRole("timer")).toBeVisible();
  expect(errors).toEqual([]);
});
