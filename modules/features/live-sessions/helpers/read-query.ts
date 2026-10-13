export function readLiveQuery(params:Record<string,string|string[]|undefined>) {
 const first=(key:string)=>Array.isArray(params[key]) ? params[key][0] : params[key];
 const status=first("status") ?? "all",page=Number(first("page"));
 return {search:(first("q") ?? "").trim().slice(0,120),status:["upcoming","active","ended"].includes(status) ? status : "all",page:Number.isSafeInteger(page)&&page>0&&page<=10000 ? page : 1};
}
