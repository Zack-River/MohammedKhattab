"use client";
import { useEffect,useState } from "react";
import { liveSessionPolicy } from "@platform/config/live-sessions";
import { endpoints } from "@platform/config/navigation";
import type { LiveSession } from "@platform/types/live-sessions";
export function useScheduleClock(initial:{sessions:LiveSession[];serverNow:string},slug?:string) {
 const [sessions,setSessions]=useState(initial.sessions),[now,setNow]=useState(Date.parse(initial.serverNow));
 useEffect(()=>{
  let serverTime=Date.parse(initial.serverNow),base=performance.now(),running=true;
  let controller:AbortController|undefined;
  const tick=setInterval(()=>setNow(serverTime+performance.now()-base),liveSessionPolicy.tickMs);
  const refresh=async()=>{
   controller?.abort();controller=new AbortController();
   try{
    const response=await fetch(slug ? endpoints.liveSessions(slug) : endpoints.myLiveSessions,{cache:"no-store",signal:controller.signal});
    if(!response.ok) return;
    const data=await response.json();
    if(running&&Array.isArray(data.sessions)&&Number.isFinite(Date.parse(data.serverNow))){
     serverTime=Date.parse(data.serverNow);base=performance.now();
     setNow(serverTime);setSessions(data.sessions);
    }
   }catch{/* Keep the last schedule on temporary failure; the server still checks joining access. */}
  };
  void refresh();
  const poll=setInterval(()=>void refresh(),liveSessionPolicy.pollMs);
  const visible=()=>{if(document.visibilityState==="visible") void refresh();};
  document.addEventListener("visibilitychange",visible);
  return()=>{
   running=false;clearInterval(tick);clearInterval(poll);controller?.abort();
   document.removeEventListener("visibilitychange",visible);
  };
 },[initial.serverNow,slug]);
 return {sessions,now};
}
