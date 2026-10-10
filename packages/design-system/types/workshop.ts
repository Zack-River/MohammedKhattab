interface RoadmapDayBase {
  number: string;
  label: string;
  title: string;
  type: string;
}

export type RoadmapDayData = RoadmapDayBase &
  (
    | {
        kind: "lesson" | "practical" | "career";
        lessons: readonly string[];
      }
    | {
        kind: "pause";
        pauseHeading: string;
        pauseDescription: string;
      }
  );

export type RoadmapStatus = "pending" | "active" | "passed";

export interface FaqItem {
  question: string;
  answer: string;
}
