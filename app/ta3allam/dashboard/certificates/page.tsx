import CertificateCard from "@platform/components/certificates/certificate-card";
import { routes } from "@platform/config/navigation";
import { interfaceCopy } from "@platform/data/interface-copy";
import PageHeading from "@platform/components/ui/page-heading";
import EmptyState from "@platform/components/ui/empty-state";
import { listCourses } from "@platform/features/catalog";
import { copy, site } from "@platform/data/site";
import { readStudentState, courseProgress } from "@platform/features/learning";
export const metadata = {
  title: interfaceCopy.certificatesPageTitle,
};
export default async function CertificatesPage() {
  const state = await readStudentState();
  const courses = await listCourses();
  const earned = courses.filter(
    (course) =>
      state.enrolled.includes(course.slug) &&
      courseProgress(course, state).percent === 100,
  );
  return (
    <>
      <PageHeading
        title={copy.certificateTitle}
        description={copy.certificateDescription}
      />
      {earned.length ? (
        <div className="lms-resource-grid">
          {earned.map((course) => (
            <CertificateCard
              interfaceCopy={{
                certificateHeading: interfaceCopy.certificateHeading,
              }}
              copy={{ print: copy.print }}
              site={{ name: site.name, demoLabel: site.demoLabel }}
              key={course.slug}
              course={course}
              learnerName={state.profile.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={copy.emptyCertificates}
          description={copy.emptyCertificatesBody}
          href={routes.library}
          label={copy.continue}
        />
      )}
    </>
  );
}
