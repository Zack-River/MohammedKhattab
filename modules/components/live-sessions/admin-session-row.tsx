"use client";
import { useState } from "react";
import AdminDialog from "@platform/components/admin/admin-dialog";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { endpoints } from "@platform/config/navigation";
import { liveSessionState,liveSessionTime } from "@platform/features/live-sessions/helpers/state";
import type { AdminLiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
export default function AdminSessionRow({session,now,courseName,labels,onEdit}:{session:AdminLiveSession;now:number;courseName:string;labels:LiveSessionLabels;onEdit:()=>void}) {
 const [removing,setRemoving]=useState(false);
 const command=useAdminSave(endpoints.adminLiveSessions,labels.error);
 return <tr><th scope="row">{session.title}<small>{courseName}</small></th>
  <td data-label={labels.starts}>{liveSessionTime(session.startsAt,session.timezone)}</td><td data-label={labels.ends}>{liveSessionTime(session.endsAt,session.timezone)}</td>
  <td data-label={labels.filter}>{session.enabled ? labels[liveSessionState(session,now)] : labels.hidden}</td>
  <td><div className="lms-admin-actions"><button type="button" className="lms-text-link" onClick={onEdit}>{labels.edit}</button><button type="button" className="lms-text-link" disabled={command.pending} onClick={()=>setRemoving(true)}>{labels.remove}</button></div>{command.error&&<p className="lms-error" role="alert">{command.error}</p>}{removing && <AdminDialog title={labels.confirmRemove} closeLabel={labels.cancel} pending={command.pending} onClose={()=>setRemoving(false)}><div className="lms-admin-actions"><button type="button" className="btn-primary" disabled={command.pending} onClick={async()=>{if(await command.save({operation:"delete",id:session.id,revision:session.revision})) setRemoving(false);}}>{labels.remove}</button><button type="button" className="lms-text-link" disabled={command.pending} onClick={()=>setRemoving(false)}>{labels.cancel}</button></div>{command.error&&<p className="lms-error" role="alert">{command.error}</p>}</AdminDialog>}</td>
 </tr>;
}
