import type { ContentBindings } from "@platform/types/content";
import { endpoints } from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
export default function CertificateCard({
  interfaceCopy,
  copy,
  site,
  course,
  learnerName,
}: {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "certificateHeading">;
  copy: Pick<ContentBindings["copy"], "print">;
  site: Pick<ContentBindings["site"], "name" | "demoLabel">;
  course: Pick<import("@platform/types/lms").Course,"slug"|"title">;
  learnerName: string;
}) {
  return (
    <article className="lms-certificate" key={course.slug}>
      <Symbol name="award" />
      <span>{site.name}</span>
      <h2>{interfaceCopy.certificateHeading}</h2>
      <p>{learnerName}</p>
      <h3>{course.title}</h3>
      <small>{site.demoLabel}</small>
      <a
        className="lms-secondary-button"
        href={endpoints.certificate(course.slug)}
      >
        <Symbol name="download" />
        {copy.print}
      </a>
    </article>
  );
}
