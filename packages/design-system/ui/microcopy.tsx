import { Fragment } from "react";

export default function Microcopy({
  items,
  reveal = false,
  className,
}: {
  items: readonly string[];
  reveal?: boolean;
  className?: string;
}) {
  return (
    <div
      data-reveal={reveal ? "" : undefined}
      className={["cta-microcopy", className].filter(Boolean).join(" ")}
    >
      {items.map((text, index) => (
        <Fragment key={text}>
          {index > 0 && (
            <span className="cta-microcopy-dot" aria-hidden="true" />
          )}
          <span>{text}</span>
        </Fragment>
      ))}
    </div>
  );
}
