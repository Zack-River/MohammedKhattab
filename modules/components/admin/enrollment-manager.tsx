"use client";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
import {useState} from "react";
import UserSubscriptions from "./user-subscriptions";
import EnrollmentForm from "./enrollment-form";
import type {EnrollmentChange,EnrollmentLabels} from "@platform/types/enrollment";
import type {UserSubscription,AdminUsersLabels} from "@platform/types/admin-users";
export default function EnrollmentManager({userId,subscriptions,courses,labels,userLabels}:{userId:string;subscriptions:UserSubscription[];courses:{slug:string;title:string}[];labels:EnrollmentLabels;userLabels:AdminUsersLabels}) {
 const hydrated=useHydrated();
 const [change,setChange]=useState<Omit<EnrollmentChange,"reason">>();
 const available=courses.filter(course=>!subscriptions.some(row=>row.slug===course.slug));
 return <div className="lms-account-stack">
  <div className="lms-admin-actions"><button type="button" className="btn-primary" disabled={!hydrated || !available.length} onClick={()=>setChange({action:"grant",courseSlug:"",revision:0})}>{labels.grant}</button></div>
  <UserSubscriptions subscriptions={subscriptions} labels={userLabels} renderAction={course=><><p>{course.active ? labels.active : labels.revoked}</p><button type="button" className="lms-text-link" disabled={!hydrated} onClick={()=>setChange({courseSlug:course.slug,revision:course.revision,action:course.active ? "revoke" : "restore"})}>{course.active ? labels.revoke : labels.restore}</button></>}/>
  {change&&<EnrollmentForm initial={change} {...{userId,labels}} courses={change.action==="grant" ? available : courses} onClose={()=>setChange(undefined)}/>}
 </div>;
}
