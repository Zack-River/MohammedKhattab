import type { CSSProperties } from "react";

export interface ComingSoonProps {
  label: string;
  detail?: string;
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  aspectRatio?: CSSProperties["aspectRatio"];
  color?: string;
}

/** Theme-aware artwork for any upcoming course, feature or release. */
export default function ComingSoon({
  label,
  detail,
  className = "",
  width = "100%",
  height,
  aspectRatio = "16 / 9",
  color,
}: ComingSoonProps) {
  const style: CSSProperties & { "--coming-soon-accent"?: string } = {
    width,
    height,
    aspectRatio: height === undefined ? aspectRatio : undefined,
    "--coming-soon-accent": color,
  };
  return (
    <div className={`coming-soon ${className}`.trim()} style={style}>
      <div className="coming-soon-art" aria-hidden="true">
        <span className="coming-soon-ghost">{detail ?? label}</span>
        <div className="coming-soon-ribbon">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>{detail ?? label}<i /></span>
          ))}
        </div>
      </div>
      <div className="coming-soon-copy">
        <span className="coming-soon-label">{label}</span>
        {detail && <span className="coming-soon-detail">{detail}</span>}
      </div>
    </div>
  );
}
