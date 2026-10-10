import { endpoints } from "@platform/config/navigation";
import { httpRequest } from "@platform/lib/http-request";
import { readLearningResponse } from "@platform/helpers/read-learning-response";
export function learningRequests(failureLabel: string) {
  const request = (path: string, body: unknown) => httpRequest({ path, body, failureLabel, decode: readLearningResponse });
  return {
    enroll: (slug: string) => request(endpoints.enrollments, { courseSlug: slug }),
    progress: (body: { courseSlug: string; lessonId: string; completed: boolean }) => request(endpoints.progress, body),
  };
}
