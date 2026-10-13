import { handleLiveSchedule } from "@platform/features/live-sessions/handle-public";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}) {
 return handleLiveSchedule((await params).slug);
}
