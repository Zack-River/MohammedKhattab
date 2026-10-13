import { randomBytes, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { updateSession } from "@platform/lib/supabase/middleware";
import { checkIngress } from "@platform/lib/security/ingress";
import { requestPolicy } from "@platform/lib/security/request-policy";
export async function proxy(request: NextRequest) {
  const requestId = randomUUID();
  const denied = await checkIngress(request, requestId);
  if (denied) return denied;
  const policy = requestPolicy(request,randomBytes(18).toString("base64"));
  request.headers.set("Content-Security-Policy", policy);
  request.headers.set("X-Request-Id", requestId);
  const response = await updateSession(request);
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("X-Request-Id", requestId);
  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
