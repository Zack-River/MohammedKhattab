import {noteCopy} from "@platform/data/materials";
import {endpoints} from "@platform/config/navigation";
import type { LessonContext } from "../read-lesson-context";
import { notesKey } from "@platform/config/persistence";
import { copy } from "@platform/data/site";
export function lessonInformationModel({ state, slug, lessonId, lesson, resources, note }: LessonContext) {
  return {
    copy: { lessonDetails: copy.lessonDetails, resources: copy.resources, notes: copy.notes,
      notesHint: copy.notesHint, notesUnavailable: copy.notesUnavailable, notesSaved: copy.notesSaved },
    resources, remoteNotes:note ? {path:endpoints.lessonNotes(slug,lessonId),initial:note,labels:noteCopy} : undefined,
    lesson, storageKey: notesKey(state.profile.email || state.profile.name, slug, lessonId),
  };
}
