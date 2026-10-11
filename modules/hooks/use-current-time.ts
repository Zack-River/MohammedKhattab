"use client";
import { useEffect, useState } from "react";
export function useCurrentTime(interval: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, interval);
    return () => window.clearInterval(timer);
  }, [interval]);
  return now;
}
