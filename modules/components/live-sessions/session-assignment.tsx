"use client";
import { useState } from "react";
import Select from "@khatab/design/ui/select";
import type { AdminLiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
export interface SessionCourseChoice {slug:string;title:string;chapters:{id:string;title:string;sections:{id:string;title:string}[]}[];}
export default function SessionAssignment({initial,courses,labels}:{initial?:AdminLiveSession;courses:SessionCourseChoice[];labels:LiveSessionLabels}) {
 const [slug,setSlug]=useState(initial?.courseSlug ?? courses[0]?.slug ?? ""),[chapter,setChapter]=useState(initial?.chapterId ?? ""),[section,setSection]=useState(initial?.sectionId ?? "");
 const chapters=courses.find(course=>course.slug===slug)?.chapters ?? [],sections=chapters.find(item=>item.id===chapter)?.sections ?? [];
 return <div className="lms-live-assignment">
  <Select label={labels.course} name="courseSlug" value={slug} onValueChange={value=>{setSlug(value);setChapter("");setSection("");}} options={courses.map(course=>({value:course.slug,label:course.title}))} />
  <Select label={labels.chapter} name="chapterId" value={chapter} onValueChange={value=>{setChapter(value);setSection("");}} options={[{value:"",label:labels.wholeCourse},...chapters.map(item=>({value:item.id,label:item.title}))]} />
  <Select label={labels.section} name="sectionId" value={section} onValueChange={setSection} options={[{value:"",label:labels.noSection},...sections.map(item=>({value:item.id,label:item.title}))]} />
 </div>;
}
