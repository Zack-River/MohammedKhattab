import test from "node:test";
import assert from "node:assert/strict";
import { liveSessionState,liveSessionDateInput } from "../../modules/features/live-sessions/helpers/state";
import { validateLiveSession } from "../../modules/features/live-sessions/helpers/validate-input";
import { readLiveQuery } from "../../modules/features/live-sessions/helpers/read-query";
const input={revision:0,courseSlug:'editing',title:'Workshop',description:'',joinUrl:'https://meet.example/session',startsLocal:'2026-10-14T12:00',endsLocal:'2026-10-14T13:00',timezone:'Africa/Cairo',enabled:true,chapterId:'',sectionId:''};
test('live joining window is start-inclusive and end-exclusive',()=>{
 const session={startsAt:'2026-10-14T09:00:00Z',endsAt:'2026-10-14T10:00:00Z'};
 for(const [time,state] of [['08:59:59','upcoming'],['09:00:00','active'],['09:59:59','active'],['10:00:00','ended']] as const) assert.equal(liveSessionState(session,Date.parse(`2026-10-14T${time}Z`)),state);
});
test('date editing retains local wall time in the session timezone',()=>{
 assert.equal(liveSessionDateInput('2026-10-14T09:00:00Z','Africa/Cairo'),'2026-10-14T12:00');
 assert.equal(liveSessionDateInput('2026-10-14T09:00:00Z','UTC'),'2026-10-14T09:00');
});
test('schedule validation rejects invalid calendars, unsafe links, bounds and hierarchy',()=>{
 assert.ok(validateLiveSession(input));
 for(const patch of [{startsLocal:'2026-02-30T12:00'},{endsLocal:input.startsLocal},{endsLocal:'2026-10-16T13:00'},{joinUrl:'javascript:alert(1)'},{joinUrl:'https://user:password@example.com'},{title:''},{title:'x'.repeat(161)},{timezone:'invalid'},{revision:-1},{revision:1.2},{sectionId:'section'},{id:'invalid'},{enabled:'true'}]) assert.equal(validateLiveSession({...input,...patch}),null);
});
test('combined schedule filters are bounded and deterministic',()=>{
 assert.deepEqual(readLiveQuery({q:'  demo  ',status:'active',page:'2'}),{search:'demo',status:'active',page:2});
 assert.equal(readLiveQuery({page:'-1',status:'invalid'}).page,1);
});
