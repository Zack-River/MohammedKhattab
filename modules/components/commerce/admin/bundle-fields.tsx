import FeaturedLayoutField from "@platform/components/admin/featured-layout-field";
import FormField from "@platform/components/ui/form-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import type { CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function BundleFields({record,labels,courses}:{record:CommerceRecord;labels:CommerceLabels;courses:readonly {slug:string;title:string}[]}) {
 return <><FeaturedLayoutField featured={record.featured} labels={labels} /><FormField name="amount" label={labels.amount} defaultValue={record.amountMinor/100 || ''} inputMode="numeric" pattern="[0-9]+" required />
 <fieldset className="lms-commerce-course-picker"><legend>{labels.courses}</legend><p className="lms-field-hint">{labels.bundleHint}</p>{courses.map(course=><Checkbox key={course.slug} name="courseSlugs" value={course.slug} label={course.title} defaultChecked={record.courseSlugs.includes(course.slug)} />)}</fieldset></>;
}
