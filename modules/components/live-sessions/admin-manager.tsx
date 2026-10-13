"use client";
import { useState } from "react";
import SessionForm from "./session-form";
import AdminSessionRow from "./admin-session-row";
import type { SessionCourseChoice } from "./session-assignment";
import type { AdminLiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
export default function AdminSessionManager({sessions,serverNow,courses,labels}:{sessions:AdminLiveSession[];serverNow:string;courses:SessionCourseChoice[];labels:LiveSessionLabels}) {
 const [editing,setEditing]=useState<AdminLiveSession|null|undefined>(undefined);
 return <div className="lms-account-stack">
  <div className="lms-admin-actions"><button type="button" className="btn-primary" onClick={()=>setEditing(null)} disabled={!courses.length}>{labels.create}</button></div>
  {editing!==undefined && <SessionForm key={editing?.id ?? "new"} initial={editing ?? undefined} {...{courses,labels}} onClose={()=>setEditing(undefined)} />}
  <div className="lms-admin-table-wrap" data-reveal data-reveal-motion="fade"><table className="lms-admin-table"><caption className="lms-visually-hidden">{labels.title}</caption>
   <thead><tr>{[labels.name,labels.starts,labels.ends,labels.filter,labels.edit].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead>
   <tbody>{sessions.map(session=><AdminSessionRow key={`${session.id}:${session.revision}`} session={session} now={Date.parse(serverNow)} courseName={courses.find(course=>course.slug===session.courseSlug)?.title ?? session.courseSlug} labels={labels} onEdit={()=>setEditing(session)} />)}</tbody>
  </table>{!sessions.length&&<p className="lms-admin-empty">{labels.empty}</p>}</div>
 </div>;
}
