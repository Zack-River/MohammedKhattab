import { readAccount } from "./repositories/read-account";
import { readStudentState, courseProgress } from "@platform/features/learning";
import { listCourses } from "@platform/features/catalog";
import { routes } from "@platform/config/navigation";
import { accountCopy } from "@platform/data/account";
import { site, copy } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import CourseGrid from "@platform/components/courses/course-grid";
import ProfileView from "@platform/components/account/profile-view";
export default async function AccountProfilePage() {
  const profile = await readAccount();
  const state = profile.admin ? null : await readStudentState();
  const courses = state ? (await listCourses()).filter(course => state.enrolled.includes(course.slug)) : [];
  return <ProfileView profile={profile} labels={accountCopy} settingsHref={profile.admin ? routes.adminSettings : routes.settings} adminHref={routes.adminDashboard}>
    {state && courses.length ? <CourseGrid courses={courses} layout="dashboard" progress={Object.fromEntries(courses.map(course => [course.slug, courseProgress(course, state)]))}
      copy={copy} site={site} offerCopy={offerCopy} /> : <p>{accountCopy.noCourses}</p>}
  </ProfileView>;
}
