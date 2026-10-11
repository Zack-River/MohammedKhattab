"use client";
import FormField from "@platform/components/ui/form-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import { useCoursePrice } from "@platform/hooks/use-course-price";
export default function CoursePriceField({ initialAmount, labels }: {
  initialAmount?: number; labels: { price: string; free: string; priceHint: string };
}) {
  const price = useCoursePrice(initialAmount);
  return <div className="lms-course-price-field">
    <FormField label={labels.price} type="text" name={price.free ? undefined : "amount"} dir="ltr" inputMode="numeric" pattern="[1-9][0-9]*"
      value={price.free ? "" : price.value} required={!price.free} disabled={price.free} placeholder={price.free ? labels.free : undefined}
      onChange={event => price.change(event.target.value)} hint={labels.priceHint} />
    <Checkbox label={labels.free} checked={price.free} onChange={event => price.setFree(event.target.checked)} />
    {price.free && <input type="hidden" name="amount" value="0" />}
  </div>;
}
