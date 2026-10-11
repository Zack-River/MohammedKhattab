import { handleConfirmation } from "@platform/features/account/handle-confirmation";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleConfirmation(request, (await params).id);
}
