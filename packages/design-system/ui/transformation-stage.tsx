import type { StageData } from "../types/marketing";

export default function TransformationStage({
  number,
  title,
  description,
  reveal = false,
}: StageData & { reveal?: boolean }) {
  return (
    <div className="stage-column" data-reveal={reveal || undefined}>
      <div className="stage-num-badge numeral">{number}</div>
      <h3 className="stage-title">{title}</h3>
      <p className="stage-desc">{description}</p>
    </div>
  );
}
