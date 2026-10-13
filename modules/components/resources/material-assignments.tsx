"use client";
import {materialPolicy} from "@platform/config/materials";
import {useState} from "react";
import Select from "@khatab/design/ui/select";
import {Checkbox} from "@khatab/design/ui/choice-controls";
import type {MaterialAssignment,CourseChoice,MaterialLabels} from "@platform/types/materials";
export default function MaterialAssignments({courses,value,onChange,labels}:{courses:CourseChoice[];value:MaterialAssignment[];onChange:(value:MaterialAssignment[])=>void;labels:MaterialLabels}) {
 const [slug,setSlug]=useState(value[0]?.courseSlug ?? courses[0]?.slug ?? ""),course=courses.find(course=>course.slug===slug);
 return <div className="lms-account-stack"><Select label={labels.course} value={slug} onValueChange={setSlug} options={courses.map(course=>({value:course.slug,label:course.title}))} />
  <fieldset className="lms-commerce-course-picker"><legend>{labels.assignments}</legend>{course?.lessons.map(lesson=>{
   const selected=value.some(item=>item.courseSlug===slug&&item.lessonId===lesson.id);
   return <Checkbox key={lesson.id} label={lesson.title} checked={selected} disabled={!selected&&value.length>=materialPolicy.assignmentsMax} onChange={()=>onChange(selected ? value.filter(item=>item.courseSlug!==slug||item.lessonId!==lesson.id) : [...value,{courseSlug:slug,lessonId:lesson.id}])} />;
  })}</fieldset><small>{labels.selected}: {value.length} / {materialPolicy.assignmentsMax}</small><p className="lms-field-hint">{labels.hint}</p>
 </div>;
}
