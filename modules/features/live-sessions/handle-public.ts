import { apiResponse } from "@platform/lib/api/respond";
import { readMyLiveSchedule } from "./repositories/my-schedule";
import { readLiveSchedule } from "./repositories/schedule";
export function handleLiveSchedule(slug:string) {
 return apiResponse(async()=>Response.json(await readLiveSchedule([slug]),{headers:{"Cache-Control":"private, no-store"}}));
}

export function handleMyLiveSchedule() {
 return apiResponse(async()=>Response.json(await readMyLiveSchedule()));
}
