import type { NextRequest } from "next/server";
import { updateSession } from "@platform/lib/supabase/middleware";
export async function proxy(request: NextRequest) { return updateSession(request); }
export const config = { matcher: ["/ta3allam/:path*", "/api/:path*"] };
