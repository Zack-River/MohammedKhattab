import type { ContentBindings } from "@platform/types/content";
import { endpoints } from "@platform/config/navigation";
import LessonNotes from "@platform/components/learning/lesson-notes";
import Symbol from "@platform/components/ui/symbol";
export default function LessonInformation({
  copy,
  resources,
  lesson,
  storageKey,
}: {
  copy: Pick<
    ContentBindings["copy"],
    | "lessonDetails"
    | "resources"
    | "notes"
    | "notesHint"
    | "notesUnavailable"
    | "notesSaved"
  >;
  resources: import("@platform/types/lms").Resource[];
  lesson: import("@platform/types/lms").Lesson;
  storageKey: string;
}) {
  return (
    <div className="lms-lesson-information">
      <section>
        <h2>{copy.lessonDetails}</h2>
        <p>{lesson.description}</p>
        <ul className="lms-takeaways">
          {lesson.takeaway.map((item) => (
            <li key={item}>
              <Symbol name="check" />
              {item}
            </li>
          ))}
        </ul>
        <h2>{copy.resources}</h2>
        {resources.map((resource) => (
          <a
            className="lms-resource-link"
            href={endpoints.resource(resource.id)}
            key={resource.id}
          >
            <Symbol name="folder" />
            <span>
              {resource.title}
              <small>{resource.type}</small>
            </span>
            <Symbol name="download" />
          </a>
        ))}
      </section>
      <LessonNotes
        copy={{
          notes: copy.notes,
          notesHint: copy.notesHint,
          notesUnavailable: copy.notesUnavailable,
          notesSaved: copy.notesSaved,
        }}
        storageKey={storageKey}
      />
    </div>
  );
}
