import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import ResourceCard from "@platform/components/resources/resource-card";
import { interfaceCopy } from "@platform/data/interface-copy";
import PageHeading from "@platform/components/ui/page-heading";
import { listResources } from "@platform/features/resources/service";
import { copy } from "@platform/data/site";
export const metadata = { title: interfaceCopy.resourcesPageTitle };
export default async function ResourcePage() {
  await requirePageIdentity();
  const resources = await listResources();
  return (
    <>
      <PageHeading
        title={copy.resources}
        description={interfaceCopy.resourcesDescription}
      />
      <div className="lms-resource-grid">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            copy={{ download: copy.download }}
            resource={resource}
          />
        ))}
      </div>
    </>
  );
}
