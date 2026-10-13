import {redirect} from "next/navigation";
import {routes} from "@platform/config/navigation";
import {readRecordQuery,recordPageHref} from "@platform/helpers/read-record-query";
import {materialPolicy} from "@platform/config/materials";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 const query=readRecordQuery(await searchParams,materialPolicy.kinds);
 redirect(recordPageHref(routes.adminTools,query,query.page));
}
