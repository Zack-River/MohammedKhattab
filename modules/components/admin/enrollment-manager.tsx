"use client";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
import {useState} from "react";
import UserSubscriptions from "./user-subscriptions";
import EnrollmentForm from "./enrollment-form";
import AccessGrantForm from "./access-grant-form";
import EnrollmentAccessStatus from "./enrollment-access-status";
import type {AccessChoice} from "@platform/types/access-grant";
import type {EnrollmentChange,EnrollmentLabels} from "@platform/types/enrollment";
import type {UserSubscription,AdminUsersLabels} from "@platform/types/admin-users";
export default function EnrollmentManager({userId,subscriptions,courses,bundles=[],labels,userLabels}:{userId:string;subscriptions:UserSubscription[];courses:{slug:string;title:string}[];bundles?:AccessChoice[];labels:EnrollmentLabels;userLabels:AdminUsersLabels}) {
 const hydrated=useHydrated();
 const [change,setChange]=useState<Omit<EnrollmentChange,"reason">>();
 const [grantOpen,setGrantOpen]=useState(false);
 return <div className="lms-account-stack">
  <div className="lms-admin-actions"><button type="button" className="btn-primary" disabled={!hydrated || (!courses.length&&!bundles.length)} onClick={()=>setGrantOpen(true)}>{labels.freeAccess}</button></div>
  <UserSubscriptions subscriptions={subscriptions} labels={userLabels} renderAction={course=><><EnrollmentAccessStatus {...{course,labels}}/><button type="button" className="lms-text-link" disabled={!hydrated} onClick={()=>setChange({courseSlug:course.slug,revision:course.revision,action:course.active ? "revoke" : "restore"})}>{course.active ? labels.revoke : labels.restore}</button></>}/>
  {change&&<EnrollmentForm initial={change} {...{userId,labels,courses}} onClose={()=>setChange(undefined)}/>}
  {grantOpen&&<AccessGrantForm {...{userId,labels,courses,bundles,subscriptions}} onClose={()=>setGrantOpen(false)}/>}
 </div>;
}
