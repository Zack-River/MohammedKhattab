"use client";

import { useRef, type JSX, type ReactNode } from "react";
import { useScrollReveals } from "@/app/hooks/use-scroll-reveals";
import JourneyProgress from "./workshop/journey-progress";
import FirstEditProvider from "./workshop/first-edit-provider";

interface WorkshopMotionProps {
  children: ReactNode;
}

export default function WorkshopMotion({
  children,
}: WorkshopMotionProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveals(rootRef);

  return (
    <FirstEditProvider>
      <div className="overflow-x-clip" ref={rootRef}>
        {children}
        <JourneyProgress rootRef={rootRef} />
      </div>
    </FirstEditProvider>
  );
}
