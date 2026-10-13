import assert from "node:assert/strict";
import {test} from "node:test";
import {validateAccessGrant} from "../../modules/features/admin/enrollments/validate-grant";
import {readAccessGrantForm} from "../../modules/helpers/access-grant-form";
const lifetime={action:"grant",kind:"course",slug:"course-one",expiresAt:null,reason:"Manual support",revisions:{"course-one":0}};
test("Free access validates lifetime, duration and exact revision snapshots",()=>{
 assert.equal(validateAccessGrant(lifetime)?.expiresAt,null);
 assert.equal(validateAccessGrant({...lifetime,expiresAt:new Date(Date.now()+86400000).toISOString()})?.kind,"course");
 for(const patch of [{expiresAt:undefined},{expiresAt:"infinity"},{expiresAt:new Date(Date.now()-1000).toISOString()},{kind:"other"},{revisions:[]},{revisions:{"course-one":"0"}},{revisions:{"bad slug":0}},{reason:" "}])assert.equal(validateAccessGrant({...lifetime,...patch}),null);
});
test("Grant forms snapshot only selected bundle members and compute custom days",()=>{
 const form=new FormData();for(const [key,value] of Object.entries({kind:"bundle",product:"bundle-one",duration:"custom",days:"2",reason:"Support"}))form.set(key,value);
 const now=Date.now(),grant=readAccessGrantForm(form,[{slug:"bundle-one",title:"Bundle",courseSlugs:["course-one","course-two"]}],[{slug:"course-one",revision:3},{slug:"unrelated",revision:8}],now);
 assert.deepEqual(grant?.revisions,{"course-one":3,"course-two":0});assert.equal(grant?.expiresAt,new Date(now+2*86400000).toISOString());
 for(const days of ["0","-1","1.5","3651","NaN"]){form.set("days",days);assert.equal(readAccessGrantForm(form,[{slug:"bundle-one",title:"Bundle",courseSlugs:["course-one"]}],[]),null);}
});
test("Lifetime form has no artificial expiry",()=>{
 const form=new FormData();form.set("kind","course");form.set("product","course-one");form.set("duration","lifetime");
 assert.equal(readAccessGrantForm(form,[{slug:"course-one",title:"Course",courseSlugs:["course-one"]}],[])?.expiresAt,null);
});

test("All-catalog forms use existing revision snapshots without requiring a product",()=>{
 const form=new FormData();form.set("kind","all");form.set("duration","lifetime");form.set("reason","Catalog grant");
 const grant=readAccessGrantForm(form,[],[{slug:"course-one",revision:3}]);
 assert.deepEqual(grant,{kind:"all",slug:"all",expiresAt:null,reason:"Catalog grant",revisions:{"course-one":3}});
 assert.ok(validateAccessGrant({...grant,action:"grant"}));
 assert.ok(validateAccessGrant({...grant,action:"grant",revisions:{}}));
 assert.equal(validateAccessGrant({...grant,action:"grant",slug:"other"}),null);
 const revisions=Object.fromEntries(Array.from({length:24},(_,i)=>["course-"+i,1]));
 assert.ok(validateAccessGrant({...grant,action:"grant",revisions}));
 assert.equal(validateAccessGrant({...grant,action:"grant",kind:"bundle",revisions}),null);
});
