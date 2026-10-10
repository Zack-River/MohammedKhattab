import { expect, test } from "@playwright/test";
import ProgressBar from "../../modules/components/ui/progress-bar";
import EmptyState from "../../modules/components/ui/empty-state";
import CourseArtwork from "../../modules/components/courses/course-artwork";
import { courses } from "../../modules/data/courses";
test("T22 T32 invalid supplied presentation models fail clearly", () => {
  const copy = { progress: "PROGRESS", lessons: "LESSONS" };
  for (const model of [
    { percent: -1, count: 0, total: 1 },
    { percent: 101, count: 1, total: 1 },
    { percent: NaN, count: 0, total: 0 },
    { percent: 50, count: 1, total: 1 },
    { percent: 0, count: -1, total: 1 },
    { percent: 50, count: 0.5, total: 1 },
  ])
    expect(() => ProgressBar({ ...model, copy })).toThrow(
      "Invalid progress model",
    );
  expect(() =>
    ProgressBar({ percent: 0, count: 0, total: 0, copy }),
  ).not.toThrow();
  expect(() =>
    EmptyState({
      title: "EMPTY",
      description: "DETAIL",
      href: "",
      label: "ACTION",
    }),
  ).toThrow("Invalid empty-state action");
  expect(() =>
    EmptyState({
      title: "EMPTY",
      description: "DETAIL",
      href: "/ta3allam/courses",
      label: " ",
    }),
  ).toThrow("Invalid empty-state action");
  expect(() =>
    EmptyState({ title: "EMPTY", description: "DETAIL" }),
  ).not.toThrow();
  expect(() =>
    CourseArtwork({
      course: {
        ...courses[0],
        artwork: "unsupported",
      } as unknown as (typeof courses)[number],
      showLabels: false,
      site: { englishName: "FIXTURE" },
    }),
  ).toThrow("Unsupported artwork variant");
});
