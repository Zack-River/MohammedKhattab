import assert from "node:assert/strict";
import {test} from "node:test";
import {readDatabasePage} from "../../modules/lib/supabase/read-page";
const success={data:[{id:"one"}],count:8,error:null};
test("Normal database pages preserve data/count without extra requests",async()=>{
 const request=Object.assign(Promise.resolve(success),{range:()=>{throw Error("Unexpected retry");}});
 assert.deepEqual(await readDatabasePage(request),success.data?{data:success.data,count:8}:null);
});
test("Out-of-range offsets return an empty page and the actual filtered count",async()=>{
 const ranges:number[][]=[];
 const request=Object.assign(Promise.resolve({data:null,count:null,error:{code:"PGRST103"}}),{range:(from:number,to:number)=>{ranges.push([from,to]);return Promise.resolve(success);}});
 assert.deepEqual(await readDatabasePage(request),{data:[],count:8});assert.deepEqual(ranges,[[0,0]]);
});
test("Database failures are preserved rather than reported as empty results",async()=>{
 for(const code of ["42501","08006"]){const request=Object.assign(Promise.resolve({data:null,count:null,error:{code}}),{range:()=>Promise.resolve(success)});await assert.rejects(readDatabasePage(request),{status:503});}
 const request=Object.assign(Promise.resolve({data:null,count:null,error:{code:"PGRST103"}}),{range:()=>Promise.resolve({data:null,count:null,error:{code:"08006"}})});await assert.rejects(readDatabasePage(request),{status:503});
});
