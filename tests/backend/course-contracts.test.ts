import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSections } from "../../modules/features/catalog/helpers/validate-sections";
import { createCourseMetadata } from "../../modules/features/admin/helpers/create-course-metadata";
import { validateCourse } from "../../modules/features/catalog/helpers/validate-course";
import { validateLessons } from "../../modules/features/catalog/helpers/validate-lessons";
import type { Course } from "../../modules/types/lms";
const draft = () => createCourseMetadata({slug:"test-course",title:"دورة اختبار",description:"وصف دورة",amount:0,category:"editing",delivery:"recorded"},{currency:"ج.م",action:"اشتراك",liveLabel:"مباشرة"});
function fixture(): Course {
 const course=draft();course.modules=[{title:"Chapter",lessons:[{id:"first",title:"Lesson",duration:"1:00",durationSeconds:60,resourceIds:[],description:"",videoUrl:"",takeaway:[]}],sections:[{id:"intro",title:"Intro",lessonIds:["first"]}]}];return course;
}
test("Drafts are editable but cannot be published without curriculum",()=>{
 const course=draft();assert.doesNotThrow(()=>validateCourse(course,new Set(),{draft:true}));assert.doesNotThrow(()=>validateLessons(course,[],{draft:true}));assert.throws(()=>validateCourse(course,new Set()));assert.throws(()=>validateLessons(course,[]));
});
test("Sections reference real lessons and cannot assign a lesson twice",()=>{
 const course=fixture();assert.doesNotThrow(()=>validateSections(course));course.modules[0].sections![0].lessonIds.push("first");assert.throws(()=>validateSections(course));
 course.modules[0].sections![0].lessonIds=["missing"];assert.throws(()=>validateSections(course));
 course.modules[0].sections![0].lessonIds=["first"];course.modules[0].sections!.push({id:"second",title:"Second",lessonIds:["first"]});assert.throws(()=>validateSections(course));
});
test("Empty named sections are valid and chapter section identifiers stay unique",()=>{
 const course=fixture();course.modules[0].sections!.push({id:"empty",title:"Empty",lessonIds:[]});assert.doesNotThrow(()=>validateSections(course));course.modules[0].sections!.push({id:"intro",title:"Duplicate",lessonIds:[]});assert.throws(()=>validateSections(course));
});
test("Live courses require duration but may have no recorded lessons",()=>{
 const course=draft();course.delivery="live";course.deliveryLabel="ورشة مباشرة";
 assert.throws(()=>validateCourse(course,new Set()));course.duration="٧ أيام";
 assert.doesNotThrow(()=>validateCourse(course,new Set()));assert.doesNotThrow(()=>validateLessons(course,[]));
});
