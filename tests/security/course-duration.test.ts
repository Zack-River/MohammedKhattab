import assert from "node:assert/strict";
import test from "node:test";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { courseDuration } from "../../modules/features/catalog/helpers/course-duration";
import { publicCourse } from "../../modules/features/catalog/helpers/public-course";
import { editCourseMetadata } from "../../modules/features/admin/helpers/edit-course-metadata";
const fixture = () => createCourseMetadata({ slug: "duration-course", title: "Duration course", description: "Course description", category: "editing", delivery: "recorded", amount: 0, duration: "wrong duration" }, { currency: "EGP", action: "Subscribe", liveLabel: "Live" });
test("Recorded courses derive duration from canonical lessons and ignore stale stored values", () => {
  const course = fixture(); assert.equal(course.duration, ""); assert.equal(courseDuration(course), "");
  course.duration = "wrong duration";
  const lesson = { id: "one", title: "Lesson", duration: "1:00", durationSeconds: 60, description: "", resourceIds: [], videoUrl: "", takeaway: [] };
  course.modules = [{ title: "Chapter", lessons: [lesson], sections: [{ id: "section", title: "Section", lessonIds: ["one"] }] }];
  assert.equal(publicCourse(course, course.slug, 0).duration, "١ دقيقة");
  course.modules[0].lessons.push({ ...lesson, id: "two", durationSeconds: 3600 });
  assert.equal(courseDuration(course), "ساعة و١ دقيقة");
  course.modules[0].lessons.splice(0, 1);
  assert.equal(courseDuration(course), "ساعة");
  course.modules[0].lessons[0].durationSeconds = 120;
  assert.equal(courseDuration(course), "٢ دقيقة");
  course.modules[0].lessons = []; assert.equal(courseDuration(course), "");
});
test("Recorded overview edits cannot override totals; live schedules remain editable", () => {
  const course = fixture(), values = { title: course.title, description: course.description, category: course.category, amount: 0, thumbnailUrl: "", introVideoUrl: "", published: false, duration: "٧ أيام" };
  assert.equal(editCourseMetadata(course, values).duration, "");
  course.delivery = "live"; course.duration = "٧ أيام";
  assert.equal(courseDuration(course), "٧ أيام");
  assert.equal(editCourseMetadata(course, { ...values, duration: "٣ أيام" }).duration, "٣ أيام");
});
