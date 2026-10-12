import { Checkbox } from "@khatab/design/ui/choice-controls";
export default function FeaturedLayoutField({ featured = false, labels }: {
  featured?: boolean; labels: { featuredLayout: string; featuredLayoutHint: string };
}) {
  return <>
    <input type="hidden" name="featured" value="false" />
    <Checkbox name="featured" label={labels.featuredLayout} hint={labels.featuredLayoutHint} defaultChecked={featured} />
  </>;
}
