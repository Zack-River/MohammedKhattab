import Link from "next/link";
import { notFound,redirect } from "next/navigation";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { readAccount } from "@platform/features/account/repositories/read-account";
import { findCourse } from "@platform/features/catalog/service";
import { findBundle } from "./repositories/bundles";
import { quotePurchase } from "./repositories/quote";
import CheckoutControls from "@platform/components/commerce/checkout-controls";
import { commerceCopy } from "@platform/data/commerce";
import { paymentCopy as labels } from "@platform/data/payment-copy";
import { routes } from "@platform/config/navigation";
export default async function CommerceCheckoutPage({slug,bundle}:{slug:string;bundle:boolean}) {
 const identity=await currentIdentity();if(!identity) redirect(routes.login);
 const product=bundle ? await findBundle(slug) : await findCourse(slug);if(!product) notFound();
 const input=bundle ? {bundleSlug:slug} : {courseSlug:slug},quote=await quotePurchase(input);
 const enrolled=await identity.client.from('enrollments').select('course_slug').eq('user_id',identity.user.id).in('course_slug',quote.courseSlugs);
 if(enrolled.error) throw new Error('Enrollment lookup failed');if(enrolled.data.length) redirect(routes.library);
 const paid=await identity.client.from('payment_orders').select('id').eq('user_id',identity.user.id).eq(bundle ? 'bundle_slug' : 'course_slug',slug).eq('status','paid').limit(1).maybeSingle();
 if(paid.error) throw new Error('Payment lookup failed');if(paid.data) redirect(routes.payment(paid.data.id));
 if(quote.baseMinor<=0) redirect(routes.courses);
 const account=await readAccount(),verified=account.emailVerified && account.phoneVerified;
 const backHref=bundle ? routes.bundle(slug) : routes.course(slug,'delivery' in product ? product.delivery : undefined);
 return <main className="container lms-public-main"><div className="lms-payment-layout"><h1>{labels.title}</h1><p>{labels.summary}</p><section className="lms-profile-card lms-payment-card" data-reveal="true"><h2>{product.title}</h2><p>{product.description}</p>
 {verified ? <CheckoutControls input={input} initial={quote} labels={commerceCopy} paymentLabels={labels} /> : <><p>{labels.verification}</p><Link className="btn-primary" href={account.admin ? routes.adminSettings : routes.settings}>{labels.settings}</Link></>}
 <Link className="lms-payment-back" href={backHref}>{labels.back}</Link></section></div></main>;
}
