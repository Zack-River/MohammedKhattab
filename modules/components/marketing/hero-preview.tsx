import { numbered } from "@platform/features/catalog/helpers/numbered";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { LandingHeroProps } from "@platform/types/landing-hero";
import CourseArtwork from "@platform/components/courses/course-artwork";
import Symbol from "@platform/components/ui/symbol";
export default function HeroPreview({ interfaceCopy, preview, artworkLessonLabel, site, actions }: Pick<LandingHeroProps, "interfaceCopy" | "artworkLessonLabel" | "site"> & {preview: NonNullable<LandingHeroProps["preview"]>; actions: NonNullable<LandingHeroProps["actions"]>}) {
  return (<div className="lms-hero-preview" data-reveal>
              <div className="lms-preview-titlebar">
                <span className="live-dot" />
                <span>{interfaceCopy.heroPreviewTitle}</span>
                <span className="lms-preview-dots">•••</span>
              </div>
              <div className="lms-preview-body">
                <CourseArtwork
                  lessonLabel={artworkLessonLabel}
                  site={{ englishName: site.englishName }}
                  course={preview.course}
                  large
                />
                <div className="lms-preview-lessons">
                  <span className="lms-small-label">
                    {interfaceCopy.heroPreviewLabel}
                  </span>
                  <h2>{preview.course.title}</h2>
                  {preview.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="lms-preview-lesson">
                      <span className="lms-lesson-number">
                        {numbered(index)}
                      </span>
                      <span>{lesson.title}</span>
                      <Symbol name={index === 0 ? "check" : "play"} />
                    </div>
                  ))}
                  <Link
                    href={actions.preview ?? routes.course(preview.course.slug)}
                  >
                    {interfaceCopy.heroPreviewAction}
                    <Symbol name="arrow" />
                  </Link>
                </div>
              </div>
            </div>);
}
