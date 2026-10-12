import assert from "node:assert/strict";
import test from "node:test";
import { isFeaturedCourse } from "../../modules/features/catalog/helpers/is-featured-course";
import { validateCourseCreate } from "../../modules/features/admin/helpers/validate-course-create";
import { validateCourseEdit } from "../../modules/features/admin/helpers/validate-course-edit";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { editCourseMetadata } from "../../modules/features/admin/helpers/edit-course-metadata";
import { readCourseCreate } from "../../modules/features/admin/helpers/read-course-create";
import { readCourseEdit } from "../../modules/features/admin/helpers/read-course-edit";
const input = { slug: "featured-test", title: "Workshop test", description: "Workshop description", amount: 500, category: "editing", delivery: "live", featured: true };
const defaults = { currency: "EGP", action: "Subscribe", liveLabel: "Live" };
test("Recorded and live courses can independently choose the featured template", () => {
  for (const delivery of ["live", "recorded"] as const) {
    const course = {delivery,featured:true};
    assert.equal(isFeaturedCourse(course),true);
  }
  for (const course of [{delivery:"live" as const},{delivery:"live" as const,featured:false}]) assert.equal(isFeaturedCourse(course),false);
});
test("Feature creation and editing validate booleans and retain omitted legacy values", () => {
  const validated = validateCourseCreate(input)!;
  const course = createCourseMetadata(validated,defaults);
  const edit = { ...input, duration: "٧ أيام", published:false, thumbnailUrl:"", introVideoUrl:"" };
  assert.equal(course.featured,true);
  assert.equal(editCourseMetadata(course,validateCourseEdit({...edit,featured:false})!).featured,false);
  assert.equal(editCourseMetadata(course,validateCourseEdit({...edit,featured:undefined})!).featured,true);
  for (const featured of ["true",1,null]) {
    assert.equal(validateCourseCreate({...input,featured}),null);
    assert.equal(validateCourseEdit({...edit,featured}),null);
  }
  assert.equal(createCourseMetadata({...validated,delivery:"recorded"},defaults).featured,true);
  const recorded = createCourseMetadata({...validated,delivery:"recorded"},defaults);
  assert.equal(editCourseMetadata(recorded,validateCourseEdit({...edit,featured:false})!).featured,false);
});
test("Checked and unchecked native forms encode real booleans", () => {
  const form = new FormData();form.append("featured","false");
  assert.equal(readCourseCreate(form).featured,false);assert.equal(readCourseEdit(form).featured,false);
  form.append("featured","on");
  assert.equal(readCourseCreate(form).featured,true);assert.equal(readCourseEdit(form).featured,true);
  form.delete("featured");assert.equal("featured" in readCourseEdit(form),false);
});
