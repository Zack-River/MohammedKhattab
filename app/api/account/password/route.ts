import { handlePassword } from "@platform/features/account/handle-password";
export function POST(request: Request) { return handlePassword(request); }
