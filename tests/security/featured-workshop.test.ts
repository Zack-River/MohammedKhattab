import assert from "node:assert/strict";
import test from "node:test";
import { isFeaturedWorkshop } from "../../modules/features/catalog/helpers/is-featured-workshop";
import { validateCourseCreate } from "../../modules/features/admin/helpers/validate-course-create";
import { validateCourseEdit } from "../../modules/features/admin/helpers/validate-course-edit";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { editCourseMetadata } from "../../modules/features/admin/helpers/edit-course-metadata";
import { readCourseCreate } from "../../modules/features/admin/helpers/read-course-create";
import { readCourseEdit } from "../../modules/features/admin/helpers/read-course-edit";
const input = { slug: "featured-test", title: "Workshop test", description: "Workshop description", amount: 500, category: "editing", delivery: "live", featured: true };
const defaults = { currency: "EGP", action: "Subscribe", liveLabel: "Live" };
test("Only explicitly featured live workshops use the campaign template", () => {
  assert.equal(isFeaturedWorkshop({delivery:"live",featured:true}),true);
  for (const course of [{delivery:"live" as const},{delivery:"live" as const,featured:false},{delivery:"recorded" as const,featured:true}]) assert.equal(isFeaturedWorkshop(course),false);
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
  assert.equal(createCourseMetadata({...validated,delivery:"recorded"},defaults).featured,undefined);
});
test("Checked and unchecked native forms encode real booleans", () => {
  const form = new FormData();form.append("featured","false");
  assert.equal(readCourseCreate(form).featured,false);assert.equal(readCourseEdit(form).featured,false);
  form.append("featured","on");
  assert.equal(readCourseCreate(form).featured,true);assert.equal(readCourseEdit(form).featured,true);
  form.delete("featured");assert.equal("featured" in readCourseEdit(form),false);
});
