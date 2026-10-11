"use client";
import { analyticsCopy as labels } from "@platform/data/admin-analytics";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="analytics-error" role="alert"><h1>{labels.error}</h1><button type="button" className="btn-primary" onClick={reset}>{labels.retry}</button></div>;
}
