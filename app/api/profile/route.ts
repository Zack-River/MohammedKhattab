import { handleProfile } from "@platform/features/profile/handle-request";
export async function GET() { return handleProfile(); }
export async function POST(request: Request) { return handleProfile(request); }
