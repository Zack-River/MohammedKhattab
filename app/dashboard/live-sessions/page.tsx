import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { readMyLiveSchedule } from "@platform/features/live-sessions/repositories/my-schedule";
import LiveSchedule from "@platform/components/live-sessions/schedule";
import { liveSessionCopy } from "@platform/data/live-sessions";
export default async function Page() {
 await requirePageIdentity();const schedule=await readMyLiveSchedule();
 return <LiveSchedule initial={schedule} joinAllowed labels={liveSessionCopy} />;
}
