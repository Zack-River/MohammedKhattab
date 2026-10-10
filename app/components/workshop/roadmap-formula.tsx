import { Fragment } from "react";
import type { RoadmapContent } from "@khatab/design/types/marketing";

export default function RoadmapFormula({
  title,
  inputs,
  result,
}: RoadmapContent["formula"]) {
  return (
    <div className="roadmap-highlight-box">
      <div className="roadmap-highlight-title">{title}</div>
      <div className="roadmap-highlight-pills">
        <div className="formula-line-inputs">
          {inputs.map((input, index) => (
            <Fragment key={index}>
              <span className="pill-item">{input}</span>
              <span className="pill-sep">
                {index === inputs.length - 1 ? "=" : "+"}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="formula-line-result">
          <span className="pill-item pill-item-accent">{result}</span>
        </div>
      </div>
    </div>
  );
}
