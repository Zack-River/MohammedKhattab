import { Checkbox } from "@khatab/design/ui/choice-controls";
export default function WorkshopFeaturedField({ featured = false, labels }: {
  featured?: boolean; labels: { featuredWorkshop: string; featuredWorkshopHint: string };
}) {
  return <>
    <input type="hidden" name="featured" value="false" />
    <Checkbox name="featured" label={labels.featuredWorkshop} hint={labels.featuredWorkshopHint} defaultChecked={featured} />
  </>;
}
