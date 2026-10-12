import Link from "next/link";
import AssetImage from "@khatab/design/ui/asset-image";
import Symbol from "@platform/components/ui/symbol";
import type { CourseDetailsProps } from "@platform/types/course-details";
export default function CourseInstructor({ instructor, labels }: Pick<CourseDetailsProps,"instructor" | "labels">) {
  return <section className="lms-course-instructor" data-reveal>
    <h2>{labels.aboutInstructor}</h2>
    <div><AssetImage asset={instructor.image} /><div><h3>{instructor.name}</h3><p>{instructor.tagline}</p></div></div>
    <Link className="lms-course-text-link" href={instructor.href}>{labels.instructorAction}<Symbol name="arrow" /></Link>
  </section>;
}
