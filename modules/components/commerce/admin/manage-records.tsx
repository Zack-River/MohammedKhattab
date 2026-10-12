"use client";
import { useCommerceEditor } from "@platform/hooks/use-commerce-editor";
import { emptyCommerceRecord } from "@platform/features/commerce/helpers/empty-record";
import AdminDialog from "@platform/components/admin/admin-dialog";
import CommerceRecordForm from "./record-form";
import CommerceRecordsTable from "./records-table";
import type { CommerceKind,CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function ManageCommerceRecords({kind,records,labels,courses,targets,closeLabel}:{kind:CommerceKind;records:CommerceRecord[];labels:CommerceLabels;courses:readonly {slug:string;title:string}[];targets:readonly {value:string;label:string}[];closeLabel:string}) {
 const editor=useCommerceEditor(kind,labels.error);
 return <><div className="lms-admin-heading-actions"><button className="btn-primary" onClick={()=>editor.open(emptyCommerceRecord())}>{labels.create}</button></div>
 <CommerceRecordsTable {...{kind,records,labels}} onEdit={editor.open} />
 {editor.selected && <AdminDialog title={editor.deleting ? labels.remove : editor.selected.revision ? labels.edit : labels.create} closeLabel={closeLabel} pending={editor.pending} onClose={editor.close}>
 {editor.deleting ? <div className="lms-commerce-form"><p>{labels.deleteConfirm}</p>{editor.error && <p role="alert" className="lms-error">{editor.error}</p>}<button className="btn-primary" disabled={editor.pending} onClick={()=>void editor.submit()}>{labels.remove}</button></div> :
 <CommerceRecordForm {...{kind,labels,courses,targets}} record={editor.selected} pending={editor.pending} error={editor.error} onSubmit={form=>void editor.submit(form)} />}</AdminDialog>}</>;
}
