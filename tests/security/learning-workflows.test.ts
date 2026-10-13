import { paymentStatusHint, paymentNeedsPolling } from "../../modules/features/payments/helpers/status-hint";
import { paymentCopy } from "../../modules/data/payment-copy";
import { isSampleLessonVideo } from "../../modules/features/payments/helpers/sample-content";
import { lessonPlaybackModel } from "../../modules/features/learning/models/lesson-playback";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { courseLessons } from "../../modules/features/catalog/helpers/course-lessons";
import { courseProgress } from "../../modules/features/learning/helpers/course-progress";
import { lessonOutline } from "../../modules/features/learning/helpers/lesson-outline";
import { applyCurriculumMutation } from "../../modules/features/admin/helpers/apply-curriculum-mutation";
import { readCommerceQuery } from "../../modules/features/commerce/helpers/read-commerce-query";
function fixture() {
  const course = createCourseMetadata({ slug: "ordered-course", title: "Ordered course", description: "Course", amount: 499, category: "editing", delivery: "recorded" }, { currency: "EGP", action: "Enroll", liveLabel: "Live" });
  const lesson = (id: string) => ({ id, title: id, duration: "1:00", durationSeconds: 60, description: "", videoUrl: "", resourceIds: [], takeaway: [] });
  course.modules = [{ id: "chapter", title: "Chapter", sections: [{ id: "section", title: "Section", lessonIds: ["second", "first"] }], lessons: [lesson("first"), lesson("second"), lesson("third")] }];
  return course;
}
test("Resume and completion follow section lesson order, including unassigned lessons", () => {
  const course = fixture();
  assert.deepEqual(courseLessons(course).map(l => l.id), ["second", "first", "third"]);
  assert.equal(courseProgress(course, { completed: [] }).next?.id, "second");
  assert.equal(courseProgress(course, { completed: ["ordered-course/second", "ordered-course/deleted", "other-course/first"] }).next?.id, "first");
  assert.equal(courseProgress(course, { completed: ["ordered-course/second", "ordered-course/deleted"] }).percent, 33);
});
test("Editing a lesson preserves its section position and does not mutate the original", () => {
  const course = fixture(), before = structuredClone(course);
  const result = applyCurriculumMutation(course, { kind: "lesson", operation: "edit", revision: 0, id: "second", chapterId: "chapter", sectionId: "section", title: "Updated", description: "", durationSeconds: 60, videoUrl: "/assets/video/workshop-intro.mp4", preview: false }, "second");
  assert.deepEqual(result.modules[0].sections![0].lessonIds, ["second", "first"]);
  assert.deepEqual(course, before);
});
test("Lesson outline preserves actual sections, unassigned grouping and current progress", () => {
  const course = fixture(), state = { enrolled: [course.slug], completed: [course.slug + "/second"], profile: { name: "Learner", email: "learner@example.com" } };
  const result = lessonOutline({ course, state, lessonHref: (slug, id) => `/learn/${slug}/${id}`, ungroupedLabel: "Additional lessons" });
  assert.deepEqual(result.modules[0].groups.map(g => g.title), ["Section", "Additional lessons"]);
  assert.equal(result.modules[0].groups[0].lessons[0].complete, true);
  assert.equal(result.modules[0].groups[1].lessons[0].href, "/learn/ordered-course/third");
  const preview = lessonOutline({course,state:{...state,enrolled:[]},lessonHref:()=>"/lesson",lockedHref:"/course"});
  assert.equal(preview.modules[0].groups[0].lessons[0].locked, true);
  assert.equal(preview.modules[0].groups[0].lessons[0].href, "/course");
});
test("Sales filters accept only known states, bound pagination and handle repeated parameters", () => {
  const states = { pending: "Pending", paid: "Paid" };
  assert.deepEqual(readCommerceQuery({ q: ["one", "two"], status: "__proto__", page: "-1" }, states), { search: "", status: "all", page: 1 });
  assert.equal(readCommerceQuery({ page: "Infinity", status: "paid", q: "x".repeat(200) }, states).page, 10000);
  assert.equal(readCommerceQuery({ q: "x".repeat(200) }, states).search.length, 100);
});

test("Terminal payment failures do not claim confirmation is pending or keep polling", () => {
  for (const status of ["failed", "expired"]) {
    assert.equal(paymentNeedsPolling(status, false), false);
    assert.notEqual(paymentStatusHint({ status, enrolled: false, bundleSlug: null }, paymentCopy), paymentCopy.pendingHint);
  }
  assert.equal(paymentNeedsPolling("pending", false), true);
  assert.equal(paymentNeedsPolling("paid", true), false);
  assert.equal(paymentNeedsPolling("paid", false), true);
  assert.equal(paymentStatusHint({ status: "paid", enrolled: true, bundleSlug: "bundle" }, paymentCopy), paymentCopy.paidBundleHint);
});

test("Original sample lesson media is recognized across YouTube URL formats", () => {
  for (const url of ["https://www.youtube-nocookie.com/embed/BQTI8hXPVD0", "https://youtu.be/BQTI8hXPVD0", "https://www.youtube.com/watch?v=BQTI8hXPVD0"]) assert.equal(isSampleLessonVideo(url), true);
  assert.equal(isSampleLessonVideo("https://youtu.be/h1G6qEPRIPg"), false);
  assert.equal(isSampleLessonVideo("/assets/video/workshop-intro.mp4"), false);
});

test("Live lesson preview actions return to the workshop route", () => {
  const course = fixture(); course.delivery = "live";
  const lessons = courseLessons(course), lesson = lessons[0];
  const model = lessonPlaybackModel({ course, lesson, slug: course.slug, lessons, index: 0, lessonId: lesson.id,
    state: { enrolled: [], completed: [], profile: { name: "", email: "" } }, resources: [], enrolled: false,
    previous: undefined, next: lessons[1], complete: false });
  assert.equal(model.actions.courseHref, "/workshops/ordered-course");
});
