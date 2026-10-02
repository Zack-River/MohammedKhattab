import ClipPreview from "./clip-preview";

export default function EditingDesk() {
  return (
    <div
      className="relative rounded-2xl border border-ink bg-ink p-5 text-foreground shadow-paper sm:p-7"
      data-editing-desk
      aria-label="نفس لقطة القهوة تتحول إلى فيديو"
    >
      <div className="mb-5 flex items-center justify-between text-xs text-muted">
        <span>فيديوك الأول</span>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-brand" />
          <span className="size-2 rounded-full bg-paper/30" />
          <span className="size-2 rounded-full bg-paper/30" />
        </div>
      </div>
      <div className="relative mb-7 flex h-story-frame items-center justify-center overflow-hidden rounded-lg bg-canvas">
        <div data-edit-frame className="relative h-full w-full">
          <ClipPreview stage="cut" compact />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-canvas via-canvas/10 to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-5 bottom-6"
            data-edit-caption
          >
            <span className="mb-2 inline-block rounded bg-brand px-3 py-1 text-xs font-semibold">
              من أول فكرة…
            </span>
            <p className="text-heading font-bold">لحاجة تستاهل تتشاف.</p>
          </div>
        </div>
        <span
          data-edit-ready
          className="absolute end-3 top-3 rounded-full bg-paper px-3 py-2 text-xs font-bold text-ink"
        >
          جاهز يتشاف ✓
        </span>
      </div>
      <div
        className="relative flex items-center gap-2 border-t border-foreground/10 pt-5"
        dir="ltr"
        aria-hidden="true"
      >
        <svg
          data-edit-spool
          className="size-10 shrink-0 text-brand"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="20" cy="20" r="17" />
          <circle cx="20" cy="20" r="3" />
          {[
            [20, 10],
            [10, 20],
            [20, 30],
            [30, 20],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />
          ))}
        </svg>
        <div className="flex grow gap-1" data-edit-cut>
          <span className="h-7 grow rounded bg-brand" />
          <span className="h-7 grow rounded bg-brand/60" />
          <span className="h-7 grow rounded bg-brand-soft" />
        </div>
      </div>
      <div
        data-edit-audio
        className="mt-3 flex h-9 items-center justify-center gap-1.5"
        aria-hidden="true"
      >
        {[2, 4, 6, 3, 7, 5, 8, 4, 6, 9, 5, 3, 7, 4, 6, 2, 5, 3].map(
          (height, index) => (
            <span
              className="w-1.5 rounded-full bg-paper/70"
              style={{ height: `calc(var(--spacing) * ${height})` }}
              key={index}
            />
          ),
        )}
      </div>
      <p className="mt-4 text-xs text-muted">
        نفس لقطة القهوة. نرتّب، نلوّن، ونضيف عنوان.
      </p>
    </div>
  );
}
