import {ApiError} from "@platform/lib/api/error";
type PageResult<Row>={data:Row[]|null;count:number|null;error:{code:string}|null};
type PageRequest<Row>=PromiseLike<PageResult<Row>>&{range(from:number,to:number):PromiseLike<PageResult<Row>>};
/** PostgREST rejects an out-of-range offset; retain the filtered count without fetching an unbounded list. */
export async function readDatabasePage<Row>(request:PageRequest<Row>) {
 const result=await request;
 if(result.error?.code==="PGRST103") {
  const first=await request.range(0,0);
  if(first.error) throw new ApiError(503,"INTERNAL_ERROR");
  return {data:[] as Row[],count:first.count??0};
 }
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return {data:result.data??[],count:result.count??0};
}
