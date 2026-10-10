import AssetImage from "./asset-image";
import type { InstructorContent } from "../types/marketing";

export default function InstructorPhoto({
  image,
  badge,
  experience,
  reveal = false,
}: Pick<InstructorContent, "image" | "badge" | "experience"> & {
  reveal?: boolean;
}) {
  return (
    <div className="instructor-photo-column" data-reveal={reveal || undefined}>
      <div className="instructor-photo-frame">
        <AssetImage asset={image} className="instructor-photo-img" />
        <div className="instructor-badges-float">
          <span className="instructor-badge-label">{badge}</span>
          <span className="instructor-exp-stat numeral">{experience}</span>
        </div>
      </div>
    </div>
  );
}
