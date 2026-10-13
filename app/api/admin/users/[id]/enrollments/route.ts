import {handleEnrollmentChange} from "@platform/features/admin/enrollments/handler";
export async function POST(request:Request,context:{params:Promise<{id:string}>}) {
 return handleEnrollmentChange(request,(await context.params).id);
}
