"use client";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
import {useId} from "react";
import {useRemoteLessonNote} from "@platform/hooks/use-remote-lesson-note";
import {useLessonNotes} from "@platform/hooks/use-lesson-notes";
import {notePolicy} from "@platform/config/materials";
import type {SavedLessonNote,NoteLabels} from "@platform/types/materials";
export default function CloudLessonNotes({path,initial,storageKey,labels}:{path:string;initial:SavedLessonNote;storageKey:string;labels:NoteLabels}) {
 const ready=useHydrated(),id=useId(),note=useRemoteLessonNote(path,initial,labels.error),local=useLessonNotes(storageKey);
 return <form className="lms-notes lms-account-stack" onSubmit={event=>{event.preventDefault();void note.save();}}><label htmlFor={id}>{labels.title}</label>
  <textarea disabled={!ready} id={id} value={note.value} onChange={event=>note.setValue(event.target.value)} placeholder={labels.hint} rows={6} maxLength={notePolicy.textMax} aria-describedby={`${id}-hint`}/>
  <small id={`${id}-hint`}>{labels.limit}</small><small role="status">{note.dirty ? labels.unsaved : labels.saved}</small>
  {!initial.text&&!note.value&&local.value&&<button type="button" className="lms-text-link" onClick={()=>note.setValue(local.value.slice(0,notePolicy.textMax))}>{labels.importLocal}</button>}
  <button type="submit" className="btn-primary" disabled={note.pending||!note.dirty}>{note.pending ? labels.saving : labels.save}</button>
  {note.error&&<p className="lms-error" role="alert">{note.error}</p>}
 </form>;
}
