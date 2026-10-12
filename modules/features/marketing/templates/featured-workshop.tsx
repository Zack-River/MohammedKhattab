import { WorkshopPage } from "@/app/components/workshop";
import { workshopPage } from "@/app/data/workshop";
import ScarcityBar from "@/app/components/workshop/scarcity-bar";
import MainSiteHeader from "../main-site-header";
import { readWorkshopTemplate } from "./repository";
import { resolveTemplateMedia } from "./helpers/template-media";
import type { Course } from "@platform/types/lms";
export default async function FeaturedWorkshop({course}:{course:Course}) {
 const {document:stored}=await readWorkshopTemplate(course),document=resolveTemplateMedia(stored,course.slug);
 const {scarcity,...editable}=document.content;
 const content={...workshopPage,...editable,header:{...workshopPage.header,...scarcity}};
 return <WorkshopPage content={content} order={document.order} showSignup={document.showSignup} header={<><MainSiteHeader />{document.showCountdown && <ScarcityBar content={scarcity} offer={editable.offer} />}</>} />;
}
