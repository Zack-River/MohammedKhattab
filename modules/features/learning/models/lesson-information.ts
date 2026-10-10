import type { LessonContext } from "../read-lesson-context";
import { notesKey } from "@platform/config/persistence";
import { copy } from "@platform/data/site";
import { resources } from "@platform/data/resources";
export function lessonInformationModel({ state, slug, lessonId, lesson }: LessonContext) {
  return {
    copy: { lessonDetails: copy.lessonDetails, resources: copy.resources, notes: copy.notes,
      notesHint: copy.notesHint, notesUnavailable: copy.notesUnavailable, notesSaved: copy.notesSaved },
    resources: lesson.resourceIds.flatMap((id) => resources.filter((resource) => resource.id === id)),
    lesson, storageKey: notesKey(state.profile.email || state.profile.name, slug, lessonId),
  };
}
