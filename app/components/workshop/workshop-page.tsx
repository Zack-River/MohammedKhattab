import type { ReactNode } from "react";
import SiteHeader from "./site-header";
import WorkshopContent from "./workshop-content";
import WorkshopSections from "./workshop-sections";
import SiteFooter from "./site-footer";
import RecentSignupToast from "./recent-signup-toast";
import type { MarketingPageContent } from "@khatab/design/types/marketing";
import { workshopSectionKeys,type WorkshopSectionKey } from "@khatab/design/types/marketing";
export default function WorkshopPage({content,header,order=workshopSectionKeys,showSignup=true}:{content:MarketingPageContent;header?:ReactNode;order?:readonly WorkshopSectionKey[];showSignup?:boolean}) {
 return <>{header ?? <SiteHeader content={content.header} offer={content.offer} />}<WorkshopContent motion={content.motion}><WorkshopSections content={content} order={order} /></WorkshopContent><SiteFooter content={content.footer} />{showSignup && <RecentSignupToast content={content.signup.content} options={content.signup.options} />}</>;
}
