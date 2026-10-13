"use client";
import {useState} from "react";
import {useAsyncCommand} from "./use-async-command";
import {saveRemoteNote} from "@platform/features/learning/client/save-note";
import type {SavedLessonNote} from "@platform/types/materials";
export function useRemoteLessonNote(path:string,initial:SavedLessonNote,errorLabel:string) {
 const [value,setValue]=useState(initial.text),[saved,setSaved]=useState(initial),command=useAsyncCommand(errorLabel);
 async function save() {
  const result=await command.run(()=>saveRemoteNote(path,{text:value,revision:saved.revision},errorLabel));
  if(result) setSaved(result);
 }
 return {value,setValue,save,dirty:value!==saved.text,pending:command.pending,error:command.error};
}
