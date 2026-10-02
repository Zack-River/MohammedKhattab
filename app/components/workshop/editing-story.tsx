"use client";

import { useRef, type ReactNode } from "react";
import { useEditingStory } from "@/app/hooks/use-editing-story";

export default function EditingStory({
  children,
  desk,
}: {
  children: ReactNode;
  desk: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEditingStory(rootRef);
  return (
    <div
      ref={rootRef}
      data-editing-story
      className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20"
    >
      <div>{children}</div>
      <div className="order-first lg:order-last lg:sticky lg:top-story-top">
        {desk}
      </div>
    </div>
  );
}
