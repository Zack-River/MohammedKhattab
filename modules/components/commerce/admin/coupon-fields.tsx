import FormField from "@platform/components/ui/form-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import type { CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function CouponFields({record,labels}:{record:CommerceRecord;labels:CommerceLabels}) {
 return <><div className="lms-commerce-fields"><FormField name="minimum" label={labels.minimum} defaultValue={record.minimumMinor/100} inputMode="numeric" pattern="[0-9]+" required />
 <FormField name="maximumUses" label={labels.maximumUses} defaultValue={record.maximumUses ?? ''} inputMode="numeric" pattern="[0-9]+" hint={labels.unlimited} />
 <FormField name="perUserLimit" label={labels.perUserLimit} defaultValue={record.perUserLimit} inputMode="numeric" pattern="[0-9]+" required /></div>
 <Checkbox name="stackable" label={labels.stackable} defaultChecked={record.stackable} /></>;
}
