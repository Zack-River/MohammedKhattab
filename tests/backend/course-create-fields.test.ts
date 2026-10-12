import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCourseCreate } from "../../modules/features/admin/helpers/validate-course-create";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
const base = { slug:"new-course",title:"New course",description:"Course description",amount:100,category:"editing",delivery:"recorded" };
test("New optional overview fields validate and persist without breaking older creation requests", () => {
  const legacy = validateCourseCreate(base); assert.ok(legacy); assert.equal(legacy.thumbnailUrl,"");
  const input = validateCourseCreate({...base,delivery:"live",duration:" ٧ أيام ",thumbnailUrl:"https://example.com/photo.jpg",introVideoUrl:"https://drive.google.com/file/d/123/view"}); assert.ok(input);
  const course = createCourseMetadata(input,{currency:"ج.م",action:"اشترك",liveLabel:"مباشرة"});
  assert.equal(course.duration,"٧ أيام");assert.equal(course.thumbnailUrl,input.thumbnailUrl);assert.equal(course.introVideoUrl,input.introVideoUrl);
});
test("Creation rejects invalid media or duration values", () => {
  for(const field of ["thumbnailUrl","introVideoUrl"]) for(const value of [null,42,"javascript:alert(1)","https://user:pass@example.com/file","/assets/../file"])
    assert.equal(validateCourseCreate({...base,[field]:value}),null);
  for(const duration of [42,null,"x".repeat(10000)]) assert.equal(validateCourseCreate({...base,duration}),null);
});
