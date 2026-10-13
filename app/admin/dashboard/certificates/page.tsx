import {requireAdminPage} from "@platform/features/admin/page-identity";
import {adminCourseTitles} from "@platform/features/admin/repositories/course-titles";
import {listCertificates} from "@platform/features/certificates/repository";
import {certificateCopy as labels} from "@platform/data/certificates";
import {certificatePolicy} from "@platform/config/certificates";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {routes,endpoints} from "@platform/config/navigation";
import PageHeading from "@platform/components/ui/page-heading";
import RecordFilters from "@platform/components/admin/record-filters";
import RecordPagination from "@platform/components/admin/record-pagination";
import CertificateIssueForm from "@platform/components/certificates/issue-form";
import CertificateAdminTable from "@platform/components/certificates/admin-table";
import CertificatePreview from "@platform/components/certificates/preview";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 await requireAdminPage();const query=readRecordQuery(await searchParams,certificatePolicy.statuses),[result,courses]=await Promise.all([listCertificates(query,true),adminCourseTitles()]);
 return <><PageHeading title={labels.title}/><div className="lms-account-stack"><CertificatePreview src={endpoints.certificatePreview} labels={labels}/><CertificateIssueForm {...{courses,labels}} endpoint={endpoints.adminCertificates} admin/>
  <RecordFilters action={routes.adminCertificates} query={query} options={[{value:"all",label:labels.all},...certificatePolicy.statuses.map(value=>({value,label:labels[value]}))]} labels={labels}/><CertificateAdminTable records={result.certificates} labels={labels}/><RecordPagination path={routes.adminCertificates} query={query} total={result.total} pageSize={certificatePolicy.pageSize} labels={labels}/></div></>;
}
