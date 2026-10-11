"use client";
import { lazy, Suspense } from "react";
import { useNearViewport } from "../hooks/use-near-viewport";
import type { TimeSeriesPoint, TimeSeriesLabels } from "../types/charts";
const TimeSeriesPlot = lazy(() => import("./time-series-plot"));
export default function TimeSeriesChart(props: { data: TimeSeriesPoint[]; labels: TimeSeriesLabels; title: string }) {
  const { ref, ready } = useNearViewport<HTMLDivElement>();
  return <div ref={ref} className="analytics-chart-slot">
    {ready && <Suspense fallback={<div className="analytics-chart" aria-busy="true" />}><TimeSeriesPlot {...props} /></Suspense>}
  </div>;
}
