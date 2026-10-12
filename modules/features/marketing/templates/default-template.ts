import { workshopPage } from "@/app/data/workshop";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { workshopCourseContent } from "../models/workshop-course";
import { workshopSectionKeys } from "@platform/config/workshop-template";
import { routes } from "@platform/config/navigation";
import { commerceCopy } from "@platform/data/commerce";
import type { ProductKind } from "@platform/types/commerce";
import type { Course } from "@platform/types/lms";
import type { WorkshopTemplate, TemplateContent } from "@platform/types/workshop-template";
export function defaultWorkshopTemplate(course: Course,kind:ProductKind="course"): WorkshopTemplate {
 const page = workshopCourseContent(workshopPage,course,liveWorkshopCourse);
 if(kind==='bundle') {const action={href:routes.bundleCheckout(course.slug),label:commerceCopy.buyBundle};page.hero={...page.hero,action};page.roadmap={...page.roadmap,action};page.finalCta={...page.finalCta,action};}
 const content = Object.fromEntries(workshopSectionKeys.map(key=>[key,page[key]])) as Pick<TemplateContent,typeof workshopSectionKeys[number]>;
 const original = course.introVideoUrl || workshopPage.hero.video.source.url;
 const video = {controls:page.hero.video.controls,controlsVariant:page.hero.video.controlsVariant,returnToPosterOnEnd:page.hero.video.returnToPosterOnEnd,title:page.hero.video.title,playLabel:page.hero.video.playLabel,caption:page.hero.video.caption,hint:page.hero.video.hint,poster:page.hero.video.poster};
 content.hero = { ...content.hero, video: { ...video, source:{kind:"file",url:original} } };
 return JSON.parse(JSON.stringify({content:{...content,footer:page.footer,signup:page.signup,offer:{...page.offer,storageKey:`workshop-${course.slug}-deadline`},scarcity:{scarcityLabel:page.header.scarcityLabel,viewerCount:page.header.viewerCount,viewerLabel:page.header.viewerLabel,countdown:page.header.countdown}},order:[...workshopSectionKeys],showCountdown:true,showSignup:course.slug===liveWorkshopCourse.slug}));
}
