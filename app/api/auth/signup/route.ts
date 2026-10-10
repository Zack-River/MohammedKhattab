import { handleAuth } from "@platform/features/auth/handle-request";
export async function POST(request: Request) { return handleAuth(request, "signup"); }
