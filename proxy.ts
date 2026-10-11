import type { NextRequest } from "next/server";
import { updateSession } from "@platform/lib/supabase/middleware";
export async function proxy(request: NextRequest) { return updateSession(request); }
export const config = { matcher: ["/", "/forgot-password", "/confirm-email", "/reset-password", "/admin/:path*", "/dashboard/:path*", "/learn/:path*", "/courses/:path*", "/workshops/:path*", "/login", "/signup", "/api/:path*"] };
