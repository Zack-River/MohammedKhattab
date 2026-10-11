import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnvironment } from "./environment";
import { routes } from "@platform/config/navigation";
export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return NextResponse.next();
  const { url, key } = supabaseEnvironment();
  let response = NextResponse.next({ request });
  const client = createServerClient(url, key, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll(values, headers) {
      values.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
    },
  } });
  if (request.nextUrl.pathname.startsWith("/admin/") || request.nextUrl.pathname === routes.dashboard || request.nextUrl.pathname.startsWith(`${routes.dashboard}/`)) {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      const target = request.nextUrl.clone();
      target.pathname = routes.login;
      target.search = "";
      const denied = NextResponse.redirect(target);
      response.cookies.getAll().forEach(cookie => denied.cookies.set(cookie));
      denied.headers.set("Cache-Control", "private, no-store");
      return denied;
    }
  } else await client.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
