import {enrollmentPolicy} from "@platform/config/enrollment";
import type {AccessChoice,AccessGrant} from "@platform/types/access-grant";
export function readAccessGrantForm(form:FormData,choices:AccessChoice[],subscriptions:{slug:string;revision:number}[],now=Date.now()):AccessGrant|null {
 const kind=form.get("kind"),slug=String(form.get("product")??""),choice=choices.find(row=>row.slug===slug),duration=form.get("duration");
 const days=duration==="custom"?Number(form.get("days")):Number(duration);
 if((kind!=="course"&&kind!=="bundle")||!choice||!choice.courseSlugs.length||(duration!=="lifetime"&&(!Number.isInteger(days)||days<1||days>enrollmentPolicy.maxDays))) return null;
 return {kind,slug,expiresAt:duration==="lifetime"?null:new Date(now+days*86400000).toISOString(),reason:String(form.get("reason")??""),revisions:Object.fromEntries(choice.courseSlugs.map(slug=>[slug,subscriptions.find(row=>row.slug===slug)?.revision??0]))};
}
