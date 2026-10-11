import "server-only";
import { cache } from "react";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { readState } from "./repositories/read-state";
export const readStudentState = cache(async () => {
  const { client, user } = await requirePageIdentity();
  return readState(client, user);
});
