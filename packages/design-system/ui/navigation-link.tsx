import Link from "next/link";
import type { ComponentProps } from "react";
type NavigationLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };
/** Native fragment navigation waits for the destination document's section. */
export default function NavigationLink({ href, ...props }: NavigationLinkProps) {
  return href.includes("#") ? <a href={href} {...props} /> : <Link href={href} {...props} />;
}
