import { interfaceCopy } from "@platform/data/interface-copy";
export default function Loading() {
  return (
    <main
      className="container lms-loading"
      aria-busy="true"
      aria-label={interfaceCopy.loadingLabel}
    >
      <div className="lms-skeleton lms-skeleton-heading" />
      <div className="lms-course-grid">
        {[1, 2, 3].map((id) => (
          <div className="lms-skeleton lms-skeleton-card" key={id} />
        ))}
      </div>
    </main>
  );
}
