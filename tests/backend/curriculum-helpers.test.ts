import assert from "node:assert/strict";
import { test } from "node:test";
import { applyCurriculumMutation } from "../../modules/features/admin/helpers/apply-curriculum-mutation";
import { curriculumCourse } from "../../modules/features/admin/helpers/curriculum-course";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { courseContentGroups } from "../../modules/features/admin/helpers/course-content-groups";
import type { Course } from "../../modules/types/lms";
function fixture(): Course {
  const course = createCourseMetadata({slug:"reusable-course",title:"Reusable course",description:"Description",amount:0,category:"editing",delivery:"recorded"},{currency:"EGP",action:"Enroll",liveLabel:"Live"});
  const lesson = (id: string) => ({id,title:id,description:"",duration:"1:00",durationSeconds:60,videoUrl:"",resourceIds:["resource"],takeaway:["Outcome"]});
  course.modules = [{title:"First",lessons:[lesson("one"),lesson("two")],sections:[{id:"intro",title:"Intro",lessonIds:["one"]}]},{title:"Second",lessons:[],sections:[{id:"intro",title:"Other intro",lessonIds:[]}]}];
  return course;
}
test("Legacy chapter identifiers are stable and normalization does not modify its input", () => {
  const course = fixture(), snapshot = structuredClone(course);
  assert.deepEqual(curriculumCourse(course).modules.map(chapter=>chapter.id),["chapter-1","chapter-2"]);
  assert.deepEqual(curriculumCourse(course),curriculumCourse(course));assert.deepEqual(course,snapshot);
});
test("Repeated lesson edits preserve order, resources and learning outcomes without mutating inputs", () => {
  const course = fixture(), snapshot = structuredClone(course);
  const edit = {kind:"lesson" as const,operation:"edit" as const,revision:0,id:"one",chapterId:"chapter-1",sectionId:"intro",title:"Edited",description:"Updated",durationSeconds:3601,videoUrl:"/assets/video/workshop-intro.mp4",preview:true};
  for(const input of [course,fixture()]) {
    const updated = applyCurriculumMutation(input,edit,"one"),lesson=updated.modules[0].lessons[0];
    assert.deepEqual(updated.modules[0].lessons.map(lesson=>lesson.id),["one","two"]);
    assert.deepEqual(lesson.resourceIds,["resource"]);assert.deepEqual(lesson.takeaway,["Outcome"]);
    assert.equal(lesson.duration,"1:00:01");assert.equal(lesson.videoUrl,"");assert.equal(lesson.preview,true);
    assert.deepEqual(updated.modules[0].sections![0].lessonIds,["one"]);
  }
  assert.deepEqual(course,snapshot);
});
test("Legacy section ids repeated across chapters resolve within the selected source chapter", () => {
  const updated = applyCurriculumMutation(fixture(),{kind:"section",operation:"edit",revision:0,id:"intro",sourceChapterId:"chapter-2",chapterId:"chapter-2",title:"Renamed second"},"intro");
  assert.equal(updated.modules[0].sections![0].title,"Intro");assert.equal(updated.modules[1].sections![0].title,"Renamed second");
  assert.throws(()=>applyCurriculumMutation(fixture(),{kind:"section",operation:"edit",revision:0,id:"intro",sourceChapterId:"chapter-1",chapterId:"chapter-2",title:"Move"},"intro"),/SECTION_ID_CONFLICT/);
});
test("A real section named ungrouped remains distinguishable from unassigned lessons", () => {
  const chapter=fixture().modules[0];chapter.sections=[{id:"ungrouped",title:"Real section",lessonIds:["one"]}];
  const groups=courseContentGroups(chapter,"Without section");assert.equal(groups[0].sectionId,"ungrouped");assert.equal(groups[1].sectionId,undefined);
});
