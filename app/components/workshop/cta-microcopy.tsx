import { Fragment, type JSX } from "react";

const features = ["محاضرات لايف", "تطبيق عملي", "متابعة مباشرة"] as const;

export default function CtaMicrocopy(): JSX.Element {
  return (
    <div className="mt-4 flex w-enrollment max-w-full items-center justify-between gap-2 text-xs text-muted sm:text-sm">
      {features.map((feature, index) => (
        <Fragment key={feature}>
          {index > 0 && (
            <span
              className="size-1 shrink-0 rounded-full bg-faint"
              aria-hidden="true"
            />
          )}
          <span>{feature}</span>
        </Fragment>
      ))}
    </div>
  );
}
