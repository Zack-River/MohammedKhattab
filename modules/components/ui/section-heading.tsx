import type { ComponentProps } from "react";
import Heading from "@khatab/design/ui/section-heading";
export default function SectionHeading(props: ComponentProps<typeof Heading>) {
  return <Heading {...props} contextVariant="plain" />;
}
