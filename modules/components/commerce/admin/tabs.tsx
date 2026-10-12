import Link from "next/link";
import { commerceKinds } from "@platform/config/commerce";
import { routes } from "@platform/config/navigation";
import type { CommerceKind,CommerceLabels } from "@platform/types/commerce";
export default function CommerceTabs({kind,labels}:{kind:CommerceKind;labels:CommerceLabels}) {
 return <nav className="lms-commerce-tabs" aria-label={labels.title}>{commerceKinds.map(value=><Link key={value} href={routes.adminCommerce(value)} aria-current={value===kind ? 'page' : undefined}>{labels[value]}</Link>)}</nav>;
}
