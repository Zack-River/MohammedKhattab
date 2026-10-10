import { Fragment } from "react";
import Icon from "./ui-icon";
import type { RichTextContent } from "../types/ui";

export default function RichText({ content }: { content: RichTextContent }) {
  return content.map((part, index) => {
    if (typeof part === "string")
      return <Fragment key={index}>{part}</Fragment>;
    if (part.kind === "break") return <br key={index} />;
    const Tag = part.kind === "strong" ? "b" : "span";
    return (
      <Tag
        key={index}
        className={part.className}
        aria-hidden={part.decorative || undefined}
      >
        {part.icon && <Icon {...part.icon} fill="currentColor" />}
        <RichText content={part.children} />
      </Tag>
    );
  });
}
