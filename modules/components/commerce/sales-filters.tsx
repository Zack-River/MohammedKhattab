import Form from "next/form";
import Link from "next/link";
import Select from "@khatab/design/ui/select";
import { routes } from "@platform/config/navigation";
import type { SalesLabels } from "@platform/types/sales";
export default function SalesFilters({labels,search,status,action = routes.adminSales}:{labels:SalesLabels;search:string;status:string;action?:string}) {
 return <Form action={action} className="lms-admin-filters lms-commerce-filters" role="search"><div className="lms-admin-search"><label htmlFor="sales-search">{labels.search}</label><input id="sales-search" type="search" name="q" defaultValue={search} maxLength={100} /></div><Select name="status" label={labels.status} defaultValue={status} options={[{value:'all',label:labels.all},...Object.entries(labels.states).map(([value,label])=>({value,label}))]} /><div className="lms-admin-actions"><button className="btn-primary">{labels.apply}</button><Link className="lms-secondary-button" href={action}>{labels.clear}</Link></div></Form>;
}
