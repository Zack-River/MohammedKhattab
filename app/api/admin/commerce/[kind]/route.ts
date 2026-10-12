import { handleCommerceAdmin } from "@platform/features/commerce/handle-admin";
type Context={params:Promise<{kind:string}>};
export async function GET(request:Request,context:Context) { return handleCommerceAdmin(request,(await context.params).kind); }
export async function POST(request:Request,context:Context) { return handleCommerceAdmin(request,(await context.params).kind); }
export async function DELETE(request:Request,context:Context) { return handleCommerceAdmin(request,(await context.params).kind); }
