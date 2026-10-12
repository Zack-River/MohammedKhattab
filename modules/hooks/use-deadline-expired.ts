"use client";
import { useEffect,useState } from "react";
/** Fixed campaign deadline; long delays are rescheduled within the browser timer limit. */
export function useDeadlineExpired(endsAt:string|null,initialSeconds:number) {
 const [expired,setExpired]=useState(Boolean(endsAt && initialSeconds<=0));
 useEffect(()=>{
  if(!endsAt) return;
  const deadline=Date.parse(endsAt);let timer:ReturnType<typeof setTimeout>;
  const schedule=()=>{const remaining=deadline-Date.now();if(remaining<=0){setExpired(true);return;}timer=setTimeout(schedule,Math.min(remaining,2_147_483_647));};
  schedule();return ()=>clearTimeout(timer);
 },[endsAt]);
 return expired;
}
