"use client";
import {useState} from "react";
import type {AdminMaterial,MaterialLabels,CourseChoice} from "@platform/types/materials";
import MaterialForm from "./material-form";
import MaterialRow from "./material-row";
export default function MaterialManager({materials,courses,labels}:{materials:AdminMaterial[];courses:CourseChoice[];labels:MaterialLabels}) {
 const [editing,setEditing]=useState<AdminMaterial|null|undefined>();
 return <div className="lms-account-stack"><div className="lms-admin-actions"><button type="button" className="btn-primary" disabled={!courses.some(course=>course.lessons.length)} onClick={()=>setEditing(null)}>{labels.create}</button></div>
  {editing!==undefined&&<MaterialForm key={editing?.id ?? "new"} initial={editing ?? undefined} {...{courses,labels}} onClose={()=>setEditing(undefined)}/>}
  <div className="lms-admin-table-wrap" data-reveal data-reveal-motion="fade"><table className="lms-admin-table"><caption className="lms-visually-hidden">{labels.title}</caption><thead><tr>{[labels.name,labels.kind,labels.assignments,labels.updated,labels.edit].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{materials.map(material=><MaterialRow key={`${material.id}:${material.revision}`} material={material} labels={labels} onEdit={()=>setEditing(material)}/>)}</tbody></table>{!materials.length&&<p className="lms-admin-empty">{labels.empty}</p>}</div>
 </div>;
}
