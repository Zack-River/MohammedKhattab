import Form from "next/form";
import Link from "next/link";
import Select from "@khatab/design/ui/select";
import { routes } from "@platform/config/navigation";
import type { CommerceKind,CommerceLabels } from "@platform/types/commerce";
export default function CommerceFilters({kind,labels,search,status}:{kind:CommerceKind;labels:CommerceLabels;search:string;status:string}) {
 return <Form action={routes.adminCommerce(kind)} className="lms-admin-filters lms-commerce-filters" role="search"><div className="lms-admin-search"><label htmlFor="commerce-search">{labels.search}</label><input id="commerce-search" type="search" name="q" defaultValue={search} maxLength={100} /></div>
 <Select name="status" label={labels.status} defaultValue={status} options={['all','active','inactive'].map(value=>({value,label:labels[value as 'all']}))} /><div className="lms-admin-actions"><button className="btn-primary">{labels.apply}</button><Link href={routes.adminCommerce(kind)} className="lms-secondary-button">{labels.clear}</Link></div></Form>;
}
