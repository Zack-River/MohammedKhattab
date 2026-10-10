import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";
import {
  remainingCountdownSeconds,
  resolveCountdownDeadline,
} from "../app/lib/countdown";

test("alternate content and multiple instances work independently", () => {
  execFileSync(process.execPath, ["tests/helpers/render-reuse.cjs"], {
    stdio: "pipe",
  });
});

test("campaigns isolate storage and refresh cadence does not alter elapsed seconds", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const options = {
    endsAt: null,
    durationSeconds: 60,
    storageKey: "campaign-a",
    tickMs: 250,
  };
  const first = resolveCountdownDeadline(options, 1000, storage);
  expect(first).toBe(61000);
  expect(remainingCountdownSeconds(first, 2000)).toBe(59);
  expect(resolveCountdownDeadline(options, 2000, storage)).toBe(first);
  expect(
    resolveCountdownDeadline(
      { ...options, storageKey: "campaign-b" },
      2000,
      storage,
    ),
  ).toBe(62000);
  expect(remainingCountdownSeconds(first, 70000)).toBe(0);
  expect(
    resolveCountdownDeadline(
      { ...options, endsAt: "2026-10-07T00:00:00Z" },
      0,
      storage,
    ),
  ).toBe(Date.parse("2026-10-07T00:00:00Z"));
  expect(
    resolveCountdownDeadline(options, 0, {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {},
    }),
  ).toBe(60000);
});
