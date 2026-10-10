import "server-only";
import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
import { currentIdentity } from "./identity";
export async function requirePageIdentity() {
  const identity = await currentIdentity();
  if (!identity) redirect(routes.login);
  return identity;
}
