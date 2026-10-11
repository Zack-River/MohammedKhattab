import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
export default async function LegacyAdminCourse({ params }: { params: Promise<{ slug: string }> }) { redirect(routes.adminCourse((await params).slug)); }
