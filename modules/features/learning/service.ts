import "server-only";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { readState } from "./repositories/read-state";
import type { LearningState } from "@platform/types/lms";
export async function readLearningState(): Promise<LearningState> {
  const identity = await currentIdentity();
  return identity ? readState(identity.client, identity.user) : { enrolled: [], completed: [], profile: { name: "", email: "" } };
}
