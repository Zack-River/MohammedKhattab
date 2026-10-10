import Eyebrow from "./eyebrow";
export default function HeadingContext({ children, variant = "badge" }: {
  children?: string; variant?: "badge" | "plain";
}) {
  if (variant === "badge") return <Eyebrow>{children}</Eyebrow>;
  return children ? <p className="lms-heading-context">{children}</p> : null;
}
