"use client";
import { useEffect, useState } from "react";
import { observeActiveSection } from "@platform/helpers/portfolio/observe-active-section";
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = observeActiveSection(ids, setActive);
    };
    observe();
    addEventListener("resize", observe);
    return () => {
      observer?.disconnect();
      removeEventListener("resize", observe);
    };
  }, [ids]);
  return active;
}
