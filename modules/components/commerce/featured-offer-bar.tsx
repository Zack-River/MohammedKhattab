"use client";
import Container from "@khatab/design/ui/container";
import { useDeadlineExpired } from "@platform/hooks/use-deadline-expired";
import DiscountCountdown from "@/app/components/workshop/discount-countdown";
import type { CountdownContent } from "@khatab/design/types/interactions";
export default function FeaturedOfferBar({offer,countdown}:{offer:{title:string;endsAt:string|null;remaining:number};countdown:CountdownContent}) {
 const options={endsAt:offer.endsAt,durationSeconds:offer.remaining,storageKey:"",tickMs:1000},expired=useDeadlineExpired(offer.endsAt,offer.remaining);
 if(expired) return null;
 return <aside className="top-scarcity-bar lms-featured-offer-bar" aria-label={offer.title}><Container className="top-bar-inner"><div className="top-scarcity-nav-capsule">
 <span className="top-live-item lms-featured-offer-name" title={offer.title}>{offer.title}</span>
 {offer.endsAt && <><span className="top-bar-sep" aria-hidden="true">•</span><DiscountCountdown content={countdown} options={options} /></>}
 </div></Container></aside>;
}
