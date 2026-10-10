import { applicationOrigin } from "@platform/lib/application-origin";
import { NextResponse } from "next/server";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { routes } from "@platform/config/navigation";
import { ensureProfile } from "@platform/features/profile/repositories/ensure-profile";
export async function GET(request: Request) {
  const url = new URL(request.url), code = url.searchParams.get("code");
  const origin = applicationOrigin();
  if (code) {
    const client = await createDatabaseClient();
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await ensureProfile(client, data.user);
      return NextResponse.redirect(new URL(routes.dashboard, origin), { headers: { "Cache-Control": "private, no-store" } });
    }
  }
  return NextResponse.redirect(new URL(routes.login, origin), { headers: { "Cache-Control": "private, no-store" } });
}
