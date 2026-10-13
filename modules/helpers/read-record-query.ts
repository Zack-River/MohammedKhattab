import {recordPolicy} from "@platform/config/records";
import type {RecordQuery} from "@platform/types/materials";
export function readRecordQuery(params:Record<string,string|string[]|undefined>,filters:readonly string[]):RecordQuery {
 const first=(key:string)=>Array.isArray(params[key]) ? params[key][0] : params[key];
 const filter=first("filter") ?? "all",page=Number(first("page"));
 return {search:(first("q") ?? "").trim().slice(0,recordPolicy.searchMax),filter:filters.includes(filter) ? filter : "all",page:Number.isSafeInteger(page)&&page>0&&page<=recordPolicy.pageMax ? page : 1};
}
export function recordPageHref(path:string,query:RecordQuery,page:number) {
 return path+"?"+new URLSearchParams({q:query.search,filter:query.filter,page:String(page)});
}
export const recordSearchPattern=(search:string)=>`%${search.replace(/[%_\\]/g,"")}%`;
