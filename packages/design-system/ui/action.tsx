import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
type Common = { children: ReactNode; className?: string };
export type ActionProps = Common &
  (
    | ({ kind: "button" } & Omit<
        ComponentPropsWithoutRef<"button">,
        "children"
      >)
    | ({ kind: "link"; href: string } & Omit<
        ComponentPropsWithoutRef<typeof Link>,
        "children"
      >)
    | ({ kind: "anchor"; href: string } & Omit<
        ComponentPropsWithoutRef<"a">,
        "children"
      >)
  );
export default function Action(props: ActionProps) {
  if (props.kind === "button") {
    const { kind, ...rest } = props;
    void kind;
    return <button type="button" {...rest} />;
  }
  if (props.kind === "link") {
    const { kind, ...rest } = props;
    void kind;
    return <Link {...rest} />;
  }
  const { kind, ...rest } = props;
  void kind;
  return <a {...rest} />;
}
