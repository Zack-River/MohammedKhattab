import { WorkshopPage } from "@/app/components/workshop";
import { workshopPage } from "@/app/data/workshop";
import FeaturedOfferBar from "@platform/components/commerce/featured-offer-bar";
import { quotePurchase } from "@platform/features/commerce/repositories/quote";
import { activeFeaturedOffer } from "./helpers/active-offer";
import type { ProductKind,PriceQuote } from "@platform/types/commerce";
import MainSiteHeader from "../main-site-header";
import { readWorkshopTemplate } from "./repository";
import { resolveTemplateMedia } from "./helpers/template-media";
import type { Course } from "@platform/types/lms";
export default async function FeaturedCourse({course,kind="course",quote:providedQuote}:{course:Course;kind?:ProductKind;quote?:PriceQuote}) {
 const {document:stored}=await readWorkshopTemplate(course,kind),document=resolveTemplateMedia(stored,course.slug,kind);
 const quote=providedQuote ?? await quotePurchase(kind==='bundle' ? {bundleSlug:course.slug} : {courseSlug:course.slug}),offer=activeFeaturedOffer(quote);
 const {scarcity,...editable}=document.content;
 const content={...workshopPage,...editable,header:{...workshopPage.header,...scarcity}};
 return <WorkshopPage content={content} order={document.order} showSignup={false} header={<><MainSiteHeader />{document.showCountdown && offer && <FeaturedOfferBar key={`${offer.title}:${offer.endsAt}`} offer={offer} countdown={scarcity.countdown} />}</>} />;
}
