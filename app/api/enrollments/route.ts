import { handleEnrollment } from "@platform/features/learning/handle-enrollment";
export async function GET() { return handleEnrollment(); }
export async function POST(request: Request) { return handleEnrollment(request); }
