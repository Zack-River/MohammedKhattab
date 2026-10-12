import type { Course } from "@platform/types/lms";
import { formatCourseDuration } from "@platform/features/catalog/helpers/format-course-duration";
import { courseSeconds } from "@platform/features/catalog/helpers/course-seconds";
import { commerceCopy } from "@platform/data/commerce";
export function bundleTemplateCourse(bundle:{slug:string;title:string;description:string;featured?:boolean;amountMinor:number},courses:Course[]):Course {
 const seconds=courses.reduce((sum,course)=>sum+courseSeconds(course),0);
 return {slug:bundle.slug,title:bundle.title,description:bundle.description,featured:bundle.featured,
 category:"business",categoryLabel:commerceCopy.bundles,deliveryLabel:commerceCopy.bundles,artwork:"business",tool:"",level:"",subtitle:"",outcomes:[],
 duration:seconds ? formatCourseDuration(seconds) : "",
 modules:courses.map(course=>({title:course.title,lessons:course.modules.flatMap(chapter=>chapter.lessons)})),
 offer:{amount:bundle.amountMinor/100,currencyLabel:commerceCopy.currency,caption:"",actionLabel:commerceCopy.buyBundle}};
}
