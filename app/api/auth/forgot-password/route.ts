import { handleRecovery } from "@platform/features/account/handle-recovery";
export function POST(request: Request) { return handleRecovery(request, "request"); }
