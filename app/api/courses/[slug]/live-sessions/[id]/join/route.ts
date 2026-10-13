import { handleLiveJoin } from "@platform/features/live-sessions/handle-join";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string;id:string}>}) {
 const {slug,id}=await params;return handleLiveJoin(slug,id);
}
