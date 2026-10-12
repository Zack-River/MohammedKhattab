import { notFound } from "next/navigation";
import { commerceKinds } from "@platform/config/commerce";
import CommerceAdminPage from "@platform/features/commerce/admin-page";
import type { CommerceKind } from "@platform/types/commerce";
export default async function Page({params,searchParams}:{params:Promise<{kind:string}>;searchParams:Promise<Record<string,string | string[] | undefined>>}) {
 const {kind}=await params;if(!commerceKinds.includes(kind as CommerceKind)) notFound();
 return <CommerceAdminPage kind={kind as CommerceKind} query={await searchParams} />;
}
