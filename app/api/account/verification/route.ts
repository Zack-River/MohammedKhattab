import { handleEmailConfirmation } from "@platform/features/account/handle-email-confirmation";
export function POST(request: Request) { return handleEmailConfirmation(request); }
