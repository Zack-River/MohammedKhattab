import { handleSettings } from "@platform/features/account/handle-settings";
export function GET() { return handleSettings(); }
export function POST(request: Request) { return handleSettings(request); }
