import type { ContentBindings } from "@platform/types/content";
import { endpoints } from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
export default function ResourceCard({
  copy,
  resource,
}: {
  copy: Pick<ContentBindings["copy"], "download">;
  resource: Pick<import("@platform/types/lms").Resource,"id"|"title"|"description"|"type">;
}) {
  return (
    <article data-reveal data-reveal-motion="fade" className="lms-resource-card" key={resource.id}>
      <div className="lms-resource-symbol">
        <Symbol name="folder" />
      </div>
      <small>{resource.type}</small>
      <h2>{resource.title}</h2>
      <p>{resource.description}</p>
      <a
        className="lms-secondary-button"
        href={endpoints.resource(resource.id)}
      >
        <Symbol name="download" />
        {copy.download}
      </a>
    </article>
  );
}
