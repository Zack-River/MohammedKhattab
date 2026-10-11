"use client";
import { useState } from "react";
import AnalyticsPanel from "@khatab/design/ui/analytics-panel";
import TimeSeriesChart from "@khatab/design/ui/time-series-chart";
import { Radio } from "@khatab/design/ui/choice-controls";
import type { AnalyticsDay, AnalyticsMetric, AnalyticsMetrics } from "@platform/types/admin-analytics";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import MetricChange from "./metric-change";
import { formatAnalyticsNumber, formatAnalyticsDate, formatChartDay } from "@platform/features/admin/analytics/helpers/format";
export default function SignupChart({ daily, metrics, labels }: { daily: AnalyticsDay[]; metrics: AnalyticsMetrics; labels: AnalyticsLabels }) {
  const [metric, setMetric] = useState<AnalyticsMetric>("students");
  const total = metric === "students" ? metrics.studentsMonth : metrics.enrollmentsMonth;
  const previous = metric === "students" ? metrics.studentsPreviousMonth : metrics.enrollmentsPreviousMonth;
  const data = daily.map(day => ({ tick: formatChartDay(day.day), label: formatAnalyticsDate(day.day, { day: "numeric", month: "long" }),
    current: day[metric], previous: metric === "students" ? day.previousStudents : day.previousEnrollments }));
  return <AnalyticsPanel title={labels.chartTitle} description={labels.chartDescription} className="analytics-signup-panel">
    <div className="analytics-chart-toolbar"><div className="analytics-chart-summary">
      <span>{labels[metric]} · {labels.month}</span><strong className="numeral">{formatAnalyticsNumber(total)}</strong>
      <MetricChange labels={labels} current={total} previous={previous} />
    </div>
    <fieldset className="analytics-chart-controls"><legend>{labels.metric}</legend>
      <Radio name="analytics-metric" label={labels.students} value="students" checked={metric === "students"} onChange={() => setMetric("students")} />
      <Radio name="analytics-metric" label={labels.enrollments} value="enrollments" checked={metric === "enrollments"} onChange={() => setMetric("enrollments")} />
    </fieldset></div>
    <div className="analytics-legend"><span data-series="current">{labels.current}</span><span data-series="previous">{labels.previous}</span></div>
    {!data.some(point => point.current > 0) && <p className="analytics-empty-note">{labels.chartEmpty}</p>}
    <TimeSeriesChart data={data} title={labels.chartTitle} labels={{ current: labels.current, previous: labels.previous, value: labels[metric] }} />
    <details className="analytics-data-table"><summary>{labels.dailyTable}</summary><div className="analytics-table-scroll">
      <table><caption>{labels[metric]}</caption><thead><tr><th scope="col">{labels.day}</th><th scope="col">{labels.current}</th><th scope="col">{labels.previous}</th></tr></thead>
        <tbody>{data.map(point => <tr key={point.label}><th scope="row">{point.label}</th><td>{point.current}</td><td>{point.previous ?? "—"}</td></tr>)}</tbody></table>
    </div></details>
  </AnalyticsPanel>;
}
