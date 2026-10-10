export const persistencePolicy = {
  notesEvent: "ta3llam-notes",
} as const;
/** Learner scope prevents switching accounts from sharing private notes. */
export const notesKey = (scope: string, slug: string, lesson: string) =>
  `ta3llam-notes:${encodeURIComponent(scope)}:${slug}:${lesson}`;
