"use client";
import { useId } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TimeSeriesPoint, TimeSeriesLabels } from "../types/charts";
import { chartGeometry } from "../config/charts";
import ChartTooltip from "./chart-tooltip";
export default function TimeSeriesPlot({ data, labels, title }: { data: TimeSeriesPoint[]; labels: TimeSeriesLabels; title: string }) {
  const gradient = `chart-fill-${useId().replaceAll(":", "")}`;
  return <div className="analytics-chart" dir="ltr" role="group" aria-label={title}>
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <ComposedChart data={data} accessibilityLayer margin={chartGeometry.margin}>
        <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--analytics-chart-current)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--analytics-chart-current)" stopOpacity="0" />
        </linearGradient></defs>
        <CartesianGrid vertical={false} stroke="var(--analytics-chart-grid)" strokeDasharray={chartGeometry.dash} />
        <XAxis dataKey="tick" axisLine={false} tickLine={false} minTickGap={chartGeometry.tickGap} tick={{ fill: "var(--text-secondary)" }} />
        <YAxis allowDecimals={false} width={chartGeometry.axisWidth} axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)" }} />
        <Tooltip content={<ChartTooltip labels={labels} />} cursor={{ stroke: "var(--border-strong)" }} />
        <Area type="linear" dataKey="current" name={labels.current} fill={`url(#${gradient})`} stroke="var(--analytics-chart-current)"
          strokeWidth={chartGeometry.strokeWidth} isAnimationActive={false} />
        <Line type="linear" dataKey="previous" name={labels.previous} stroke="var(--analytics-chart-previous)"
          strokeDasharray={chartGeometry.dash} strokeWidth={chartGeometry.strokeWidth} dot={false} connectNulls={false} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  </div>;
}
