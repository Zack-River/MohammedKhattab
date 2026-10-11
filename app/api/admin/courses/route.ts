import { handleCourseList } from "@platform/features/admin/handle-course-list";
export function GET(request: Request) { return handleCourseList(request); }
export function POST(request: Request) { return handleCourseList(request, true); }
