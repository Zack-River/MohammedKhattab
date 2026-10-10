import { expect, test } from "@playwright/test";
import { youtubeSdkStub } from "./helpers/youtube-sdk-stub";
const fixtureUrl = process.env.REUSE_BASE_URL ?? "http://localhost:3043";
test("shared YouTube helpers defer SDK, handle controls and release a replaced player", async ({ page }) => {
  let sdkLoads = 0;
  await page.route("https://www.youtube.com/iframe_api", (route) => {
    sdkLoads++;
    return route.fulfill({ contentType: "application/javascript", body: youtubeSdkStub });
  });
  await page.route("**/embed/**", (route) => route.fulfill({ contentType: "text/html", body: "<html></html>" }));
  await page.goto(`${fixtureUrl}/youtube-player`);
  expect(sdkLoads).toBe(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Activate SDK" }).click();
  const player = page.getByRole("region", { name: "SDK player" });
  await expect(player.getByRole("button", { name: "PAUSE", exact: true })).toBeEnabled();
  await expect(page.locator("iframe")).toHaveAttribute("src", /controls=0.*enablejsapi=1/);
  await player.focus();
  await page.keyboard.press("k");
  await expect(player.getByRole("button", { name: "PLAY", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(player.getByRole("slider", { name: "SEEK" })).toHaveValue("5");
  await page.keyboard.press("m");
  await expect(player.getByRole("button", { name: "UNMUTE" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Toggle player" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  const destroyed = () => page.evaluate(() => {
    const records = (window as Window & { sdkPlayers?: { destroyed: boolean }[] }).sdkPlayers;
    return records?.map((record) => record.destroyed) ?? [];
  });
  expect(await destroyed()).toEqual([true]);
  await page.getByRole("button", { name: "Toggle player" }).click();
  await page.getByRole("button", { name: "Activate SDK" }).click();
  await expect(player.getByRole("button", { name: "PAUSE", exact: true })).toBeEnabled();
  expect(sdkLoads).toBe(1);
  expect(await destroyed()).toEqual([true, false]);
});

test("failed shared SDK loading is recoverable on retry", async ({ page }) => {
  let sdkLoads = 0;
  await page.route("https://www.youtube.com/iframe_api", (route) => {
    sdkLoads++;
    return sdkLoads === 1 ? route.abort() : route.fulfill({ contentType: "application/javascript", body: youtubeSdkStub });
  });
  await page.route("**/embed/**", (route) => route.fulfill({ contentType: "text/html", body: "<html></html>" }));
  await page.goto(`${fixtureUrl}/youtube-player`);
  await page.getByRole("button", { name: "Activate SDK" }).click();
  await expect(page.getByRole("region", { name: "SDK player" }).getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "RETRY" }).click();
  await expect(page.getByRole("button", { name: "PAUSE", exact: true })).toBeEnabled();
  expect(sdkLoads).toBe(2);
});
