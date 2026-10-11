import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
export default function LegacyAdminCourses() { redirect(routes.admin); }
