"use client";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "./use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { endpoints, routes } from "@platform/config/navigation";
import { readCourseCreate } from "@platform/features/admin/helpers/read-course-create";
import { decodeCourseCreated } from "@platform/features/admin/helpers/decode-course-created";
export function useCreateCourse(errorLabel: string) {
  const router = useRouter(), command = useAsyncCommand(errorLabel);
  async function create(form: FormData) {
    const slug = await command.run(() => httpRequest({ path: endpoints.adminCourses, body: readCourseCreate(form), failureLabel: errorLabel, decode: value => decodeCourseCreated(value, errorLabel) }));
    if (slug) router.push(routes.adminCourse(slug));
  }
  return { create, pending: command.pending, error: command.error };
}
