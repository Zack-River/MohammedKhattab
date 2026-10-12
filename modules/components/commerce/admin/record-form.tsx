import FormField from "@platform/components/ui/form-field";
import TextareaField from "@platform/components/ui/textarea-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import BundleFields from "./bundle-fields";
import DiscountFields from "./discount-fields";
import CouponFields from "./coupon-fields";
import { commercePolicy } from "@platform/config/commerce";
import type { CommerceKind,CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function CommerceRecordForm({kind,record,labels,courses,targets,pending,error,onSubmit}:{kind:CommerceKind;record:CommerceRecord;labels:CommerceLabels;courses:readonly {slug:string;title:string}[];targets:readonly {value:string;label:string}[];pending:boolean;error:string;onSubmit:(form:FormData)=>void}) {
 return <form className="lms-profile-form lms-admin-form lms-commerce-form" onSubmit={event=>{event.preventDefault();onSubmit(new FormData(event.currentTarget));}}>
 <fieldset disabled={pending}><div className="lms-commerce-fields"><FormField name="title" label={labels.name} defaultValue={record.title} required maxLength={commercePolicy.maxTitle} />
 <FormField name="key" label={labels.key} defaultValue={record.key} readOnly={record.revision>0} required dir="ltr" maxLength={kind==='coupons' ? commercePolicy.maxCouponLength : 100} pattern={kind==='coupons' ? '[A-Z0-9_-]+' : '[a-z0-9]+(-[a-z0-9]+)*'} /></div>
 <TextareaField name="description" label={labels.description} defaultValue={record.description} maxLength={commercePolicy.maxDescription} rows={3} />
 {kind==='bundles' ? <BundleFields {...{record,labels,courses}} /> : <DiscountFields {...{record,labels,targets}} coupon={kind==='coupons'} />}
 {kind==='coupons' && <CouponFields {...{record,labels}} />}<Checkbox name="enabled" label={labels.enabled} defaultChecked={record.enabled} /></fieldset>
 {error && <p className="lms-error" role="alert">{error}</p>}<button className="btn-primary" disabled={pending}>{pending ? labels.saving : labels.save}</button></form>;
}
