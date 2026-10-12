import { handleWorkshopTemplate } from "@platform/features/marketing/templates/handle-template";
type Context={params:Promise<{slug:string}>};
export async function GET(_request:Request,{params}:Context) {return handleWorkshopTemplate((await params).slug);}
export async function POST(request:Request,{params}:Context) {return handleWorkshopTemplate((await params).slug,request);}
