import Form from "next/form";
import Link from "next/link";
import Select from "@khatab/design/ui/select";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import { routes } from "@platform/config/navigation";
import { courseAdministration, courseStatuses, courseSorts, courseDeliveries } from "@platform/config/course-administration";
import { courseQueryUrl } from "@platform/features/admin/helpers/course-query-url";
import type { AdminCourseQuery, AdminCoursesLabels } from "@platform/types/admin-courses";
export default function CourseFilters({ query, total, labels, categories }: { query: AdminCourseQuery; total: number; labels: AdminCoursesLabels; categories: readonly { id: string; label: string }[] }) {
 return <Form key={courseQueryUrl(query)} action={routes.admin} className="lms-admin-filters" role="search" aria-label={labels.search}>
  <div className="lms-admin-search"><label htmlFor="admin-course-search">{labels.search}</label><input type="search" id="admin-course-search" name="q" defaultValue={query.search} placeholder={labels.searchHint} maxLength={courseAdministration.searchMaxLength} /></div>
  <fieldset><legend>{labels.filters}</legend><div className="lms-admin-filter-options">{courseStatuses.map(status => <Checkbox key={status} name="status" value={status} label={labels[status]} defaultChecked={query.statuses.includes(status)} />)}</div></fieldset>
  <div className="lms-course-filter-selects"><Select name="category" label={labels.category} defaultValue={query.category} options={categories.map(category => ({value:category.id,label:category.label}))} />
   <Select name="delivery" label={labels.delivery} defaultValue={query.delivery} options={courseDeliveries.map(value => ({value,label:labels[value]}))} />
   <Select name="sort" label={labels.order} defaultValue={query.sort} options={courseSorts.map(value => ({value,label:labels[value]}))} />
   <Select name="direction" label={labels.direction} defaultValue={query.direction} options={["desc","asc"].map(value => ({value,label:labels[value as "desc"]}))} /></div>
  <div className="lms-admin-filter-footer"><div className="lms-admin-actions"><button type="submit" className="btn-primary">{labels.apply}</button><Link href={routes.admin} className="lms-secondary-button">{labels.clear}</Link></div><p className="lms-admin-result-count">{labels.results}: <strong>{total}</strong></p></div>
 </Form>;
}
