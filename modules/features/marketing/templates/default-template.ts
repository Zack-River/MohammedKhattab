import { workshopPage } from "@/app/data/workshop";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { workshopCourseContent } from "../models/workshop-course";
import { workshopSectionKeys } from "@platform/config/workshop-template";
import type { Course } from "@platform/types/lms";
import type { WorkshopTemplate, TemplateContent } from "@platform/types/workshop-template";
export function defaultWorkshopTemplate(course: Course): WorkshopTemplate {
 const page = workshopCourseContent(workshopPage,course,liveWorkshopCourse);
 const content = Object.fromEntries(workshopSectionKeys.map(key=>[key,page[key]])) as Pick<TemplateContent,typeof workshopSectionKeys[number]>;
 const original = course.introVideoUrl || workshopPage.hero.video.source.url;
 const video = {controls:page.hero.video.controls,controlsVariant:page.hero.video.controlsVariant,returnToPosterOnEnd:page.hero.video.returnToPosterOnEnd,title:page.hero.video.title,playLabel:page.hero.video.playLabel,caption:page.hero.video.caption,hint:page.hero.video.hint,poster:page.hero.video.poster};
 content.hero = { ...content.hero, video: { ...video, source:{kind:"file",url:original} } };
 return JSON.parse(JSON.stringify({content:{...content,footer:page.footer,signup:page.signup,offer:{...page.offer,storageKey:`workshop-${course.slug}-deadline`},scarcity:{scarcityLabel:page.header.scarcityLabel,viewerCount:page.header.viewerCount,viewerLabel:page.header.viewerLabel,countdown:page.header.countdown}},order:[...workshopSectionKeys],showCountdown:true,showSignup:course.slug===liveWorkshopCourse.slug}));
}
