import type { ComponentPropsWithoutRef } from "react";
import type { SectionHeadingContent } from "../types/ui";
import HeadingContext from "./heading-context";
import RichText from "./rich-text";

export default function SectionHeading({
  content,
  contextVariant = "badge",
  className,
  titleClassName,
  descriptionClassName,
  children,
  ...props
}: {
  content: SectionHeadingContent;
  contextVariant?: "badge" | "plain";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "content">) {
  return (
    <div {...props} className={className}>
      <HeadingContext variant={contextVariant}>{content.eyebrow}</HeadingContext>
      <h2 className={["headline-h2", titleClassName].filter(Boolean).join(" ")}>
        <RichText content={content.title} />
      </h2>
      {children}
      {content.description && (
        <p
          className={["body-large", descriptionClassName]
            .filter(Boolean)
            .join(" ")}
        >
          <RichText content={content.description} />
        </p>
      )}
    </div>
  );
}
