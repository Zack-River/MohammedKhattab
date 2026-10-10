import type { Course } from "@platform/types/lms";
import TimelineArtwork from "./timeline";
import MotionArtwork from "./motion";
import DesignArtwork from "./design";
import BusinessArtwork from "./business";
const illustrations = { timeline: TimelineArtwork, motion: MotionArtwork, design: DesignArtwork, business: BusinessArtwork };
export default function CourseIllustration({ kind }: { kind: Course["artwork"] }) {
  const Illustration = illustrations[kind];
  return <Illustration />;
}
