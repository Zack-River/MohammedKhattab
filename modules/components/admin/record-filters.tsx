import {recordPolicy} from "@platform/config/records";
import Form from "next/form";
import Select from "@khatab/design/ui/select";
import type {RecordQuery} from "@platform/types/materials";
export default function RecordFilters({action,query,options,labels}:{action:string;query:RecordQuery;options:{value:string;label:string}[];labels:{search:string;filter:string;apply:string}}) {
 return <Form action={action} className="lms-admin-filters lms-record-filters" role="search"><label className="lms-admin-search">{labels.search}<input name="q" type="search" defaultValue={query.search} maxLength={recordPolicy.searchMax} /></label><Select name="filter" label={labels.filter} defaultValue={query.filter} options={options} /><button type="submit" className="btn-primary">{labels.apply}</button></Form>;
}
