import CertificateCard from "@platform/components/certificates/certificate-card";
import CertificateIssueForm from "@platform/components/certificates/issue-form";
import RecordFilters from "@platform/components/admin/record-filters";
import RecordPagination from "@platform/components/admin/record-pagination";
import PageHeading from "@platform/components/ui/page-heading";
import {routes,endpoints} from "@platform/config/navigation";
import {certificateCopy as labels,certificateDocument} from "@platform/data/certificates";
import {certificatePolicy} from "@platform/config/certificates";
import {listCertificates,eligibleCertificateCourses,certificateAccessSlugs} from "@platform/features/certificates/repository";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {copy,site} from "@platform/data/site";
import {requirePageIdentity} from "@platform/features/auth/server/page-identity";
export const metadata={title:labels.title};
export default async function CertificatesPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 await requirePageIdentity();const query=readRecordQuery(await searchParams,certificatePolicy.statuses),[eligible,result,access]=await Promise.all([eligibleCertificateCourses(),listCertificates(query),certificateAccessSlugs()]);
 return <><PageHeading title={copy.certificateTitle} description={copy.certificateDescription}/><div className="lms-account-stack">
  {eligible.length>0&&<CertificateIssueForm key={eligible.map(course=>course.slug).join(":")} courses={eligible} labels={labels} endpoint={endpoints.certificates}/>}<RecordFilters action={routes.certificates} query={query} options={[{value:"all",label:labels.all},...certificatePolicy.statuses.map(value=>({value,label:labels[value]}))]} labels={labels}/>
  <div className="lms-resource-grid">{result.certificates.map(record=><CertificateCard key={record.id} record={record} accessible={access.has(record.course_slug)} labels={labels} heading={certificateDocument.title} brand={site.name}/>)}</div>{!result.total&&<p className="lms-admin-empty">{labels.empty}</p>}
  <RecordPagination path={routes.certificates} query={query} total={result.total} pageSize={certificatePolicy.pageSize} labels={labels}/></div></>;
}
