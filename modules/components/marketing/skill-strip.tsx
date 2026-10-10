import type { ContentBindings } from "@platform/types/content";

export default function SkillStrip({
  interfaceCopy,
  skillStripItems,
}: {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "skillStripLabel">;
  skillStripItems: readonly string[];
}) {
  return (
    <section className="lms-skill-strip">
      <div className="container">
        <span>{interfaceCopy.skillStripLabel}</span>
        {skillStripItems.map((tool) => (
          <b key={tool}>{tool}</b>
        ))}
      </div>
    </section>
  );
}
