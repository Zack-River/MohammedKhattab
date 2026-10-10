import "server-only";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { readState } from "./repositories/read-state";
export async function readStudentState() {
  const { client, user } = await requirePageIdentity();
  return readState(client, user);
}
