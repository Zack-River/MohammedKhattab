import { publicCourse } from "../../modules/features/catalog/helpers/public-course";
import { expect, test } from "@playwright/test";
import { courses } from "../../modules/data/courses";
import { catalogSettings } from "../../modules/data/catalog-settings";
import {
  courseLessons,
  courseSeconds,
  formatCourseDuration,
  numbered,
  selectCourses,
  selectPreview,
  validateCatalog,
  parseLessonTime,
} from "../../modules/features/catalog/helpers";
import {
  courseProgress,
} from "../../modules/features/learning/helpers";
import { validateProfile } from "../../modules/features/profile/validation";
import { routes, endpoints } from "../../modules/config/navigation";
import { notesKey } from "../../modules/config/persistence";
import { resources } from "../../modules/data/resources";

test("T11 T12 explicit selections and associated resources survive reorder", () => {
  expect(
    selectCourses([...courses].reverse(), catalogSettings.showcaseIds).map(
      (course) => course.slug,
    ),
  ).toEqual([...catalogSettings.showcaseIds]);
  expect(selectCourses([], catalogSettings.showcaseIds)).toEqual([]);
  const lesson = courseLessons(courses[0]).find(
    (item) => item.id === "first-cut",
  )!;
  expect(lesson.resourceIds).toEqual(["project-checklist", "creative-brief"]);
  expect(courseLessons(courses[1])[0].resourceIds).toEqual([]);
});
test("T13 route builders reject path injection and preserve query values", () => {
  expect(routes.lesson("editing-foundations", "first-cut")).toBe(
    "/ta3allam/learn/editing-foundations/first-cut",
  );
  expect(endpoints.resource("project-checklist")).toBe(
    "/api/resources/project-checklist",
  );
  for (const input of ["../x", "a/b", "a?x", "a#b", "", "%2F"])
    expect(() => routes.course(input)).toThrow();
  expect(
    new URL(
      routes.catalog("a & b", "motion"),
      "https://example.com",
    ).searchParams.get("q"),
  ).toBe("a & b");
});
test("T14 shared profile boundary validation", () => {
  const email = "student@example.com";
  for (const length of [1, 61])
    expect(validateProfile({ name: "a".repeat(length), email })).toBeNull();
  for (const length of [2, 60])
    expect(validateProfile({ name: "a".repeat(length), email })).not.toBeNull();
  for (const length of [100, 101])
    expect(
      Boolean(
        validateProfile({
          name: "Student",
          email: "a".repeat(length - 6) + "@a.com",
        }),
      ),
    ).toBe(length === 100);
  expect(
    validateProfile({ name: "  Student  ", email: " student@example.com " }),
  ).toEqual({ name: "Student", email });
  for (const invalid of [
    null,
    {},
    { name: 8, email },
    { name: "Student", email: "invalid" },
  ])
    expect(validateProfile(invalid)).toBeNull();
});
test("T15 note scopes and lessons are isolated", () => {
  expect(
    new Set([
      notesKey("a", "course", "one"),
      notesKey("b", "course", "one"),
      notesKey("a", "course", "two"),
    ]).size,
  ).toBe(3);
});
test("T16 course summaries have one numeric source and numbering handles ten", () => {
  expect(courseSeconds(courses[0])).toBe(7200);
  expect(courses[0].duration).toBe("ساعتان");
  for (const course of courses)
    expect(course.duration).toBe(formatCourseDuration(courseSeconds(course)));
  expect([0, 8, 9, 10].map(numbered)).toEqual(["01", "09", "10", "11"]);
  expect(() => parseLessonTime("12:75")).toThrow();
  expect(() => parseLessonTime("bad")).toThrow();
});
test("T17 T32 progress is finite, deduplicated and total-completion safe", () => {
  const empty = { ...courses[0], modules: [] };
  expect(courseProgress(empty, { completed: [] })).toEqual({
    count: 0,
    total: 0,
    percent: 0,
    next: undefined,
  });
  const keys = courseLessons(courses[0]).map(
    (lesson) => `${courses[0].slug}/${lesson.id}`,
  );
  const all = courseProgress(courses[0], {
    completed: [...keys, ...keys, "unknown/lesson"],
  });
  expect(all.count).toBe(keys.length);
  expect(all.percent).toBe(100);
  expect(all.next).toBeUndefined();
  expect(courseProgress(courses[0], { completed: [] }).percent).toBe(0);
  validateCatalog(
    courses,
    resources.map((resource) => resource.id),
  );
  expect(() => validateCatalog([empty], [])).toThrow(/Empty|Invalid/);
  expect(() =>
    validateCatalog(
      [courses[0], courses[0]],
      resources.map((resource) => resource.id),
    ),
  ).toThrow(/Invalid/);
});

test("T14 T32 public projection strips playback and validates published records", () => {
  const clean = publicCourse(courses[0], courses[0].slug, 123);
  expect(clean.offer.amount).toBe(123);
  expect(courseLessons(clean).every(lesson => lesson.videoUrl === "")).toBe(true);
  expect(courseLessons(courses[0]).some(lesson => lesson.videoUrl)).toBe(true);
  const invalids = [
    { ...courses[0], artwork: "unsupported" },
    { ...courses[0], offer: { ...courses[0].offer, amount: -1 } },
    {
      ...courses[0],
      modules: [{ title: "empty", lessons: [] }, ...courses[0].modules],
    },
    { ...courses[0], slug: "../bad" },
    {
      ...courses[0],
      modules: [
        {
          title: "bad",
          lessons: [
            { ...courses[0].modules[0].lessons[0], resourceIds: ["unknown"] },
          ],
        },
      ],
    },
  ];
  for (const invalid of invalids)
    expect(() =>
      validateCatalog(
        [invalid as (typeof courses)[number]],
        resources.map((resource) => resource.id),
      ),
    ).toThrow();
});

test("T11 preview identity and configured lesson order survive module reordering", () => {
  const reordered = courses
    .map((course) => ({
      ...course,
      modules: [...course.modules].reverse().map((module) => ({
        ...module,
        lessons: [...module.lessons].reverse(),
      })),
    }))
    .reverse();
  const preview = selectPreview(
    reordered,
    catalogSettings.previewCourseId,
    catalogSettings.previewLessonIds,
  );
  expect(preview?.course.slug).toBe(catalogSettings.previewCourseId);
  expect(preview?.lessons.map((lesson) => lesson.id)).toEqual([
    ...catalogSettings.previewLessonIds,
  ]);
  expect(selectPreview([], "missing", [])).toBeUndefined();
  expect(
    selectPreview(courses, catalogSettings.previewCourseId, ["missing"])
      ?.lessons,
  ).toEqual([]);
});
