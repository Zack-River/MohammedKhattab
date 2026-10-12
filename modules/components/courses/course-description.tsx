export default function CourseDescription({ title, description }: { title: string; description: string }) {
  return <section className="lms-course-description" data-reveal>
    <h2>{title}</h2>
    <div className="lms-course-prose">{description.split(/\n\s*\n/).filter(Boolean).map((paragraph,index) => <p key={index}>{paragraph}</p>)}</div>
  </section>;
}
