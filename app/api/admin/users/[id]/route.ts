import { handleAdminUser } from "@platform/features/admin/handle-user";
type Context = { params: Promise<{ id: string }> };
export async function GET(_: Request, context: Context) { return handleAdminUser((await context.params).id); }
export async function POST(request: Request, context: Context) { return handleAdminUser((await context.params).id, request); }
