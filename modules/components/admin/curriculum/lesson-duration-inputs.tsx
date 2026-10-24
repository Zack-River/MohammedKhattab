"use client";
import { useEffect, useId, useState } from "react";
import type { CurriculumLabels } from "@platform/types/curriculum";

interface LessonDurationInputsProps {
  seconds: number | undefined;
  onChange: (totalSeconds: number | undefined) => void;
  pending?: boolean;
  error?: string;
  labels: CurriculumLabels;
  onRetry?: () => void;
}

function parsePart(val: string, max: number): number {
  const digits = val.replace(/\D/g, "");
  return digits ? Math.min(max, Math.max(0, parseInt(digits, 10))) : 0;
}

function blockKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["-", "+", "e", "E", ".", ","].includes(e.key)) e.preventDefault();
}

export default function LessonDurationInputs({ seconds, onChange, pending, error, labels, onRetry }: LessonDurationInputsProps) {
  const id = useId();
  const [h, setH] = useState(() => (seconds ? String(Math.floor(seconds / 3600)) : "0"));
  const [m, setM] = useState(() => (seconds ? String(Math.floor((seconds % 3600) / 60)) : "0"));
  const [s, setS] = useState(() => (seconds ? String(seconds % 60) : "0"));

  useEffect(() => {
    if (typeof seconds === "number" && seconds > 0) {
      setH(String(Math.floor(seconds / 3600)));
      setM(String(Math.floor((seconds % 3600) / 60)));
      setS(String(seconds % 60));
    } else if (!seconds) {
      setH("0"); setM("0"); setS("0");
    }
  }, [seconds]);

  const update = (hVal: string, mVal: string, sVal: string) => {
    const total = parsePart(hVal, 24) * 3600 + parsePart(mVal, 59) * 60 + parsePart(sVal, 59);
    onChange(total > 0 ? total : undefined);
  };

  const handleH = (v: string) => { const n = v.replace(/\D/g, ""); setH(n ? String(Math.min(24, parseInt(n, 10))) : ""); update(n, m, s); };
  const handleM = (v: string) => { const n = v.replace(/\D/g, ""); setM(n ? String(Math.min(59, parseInt(n, 10))) : ""); update(h, n, s); };
  const handleS = (v: string) => { const n = v.replace(/\D/g, ""); setS(n ? String(Math.min(59, parseInt(n, 10))) : ""); update(h, m, n); };
  const hintText = pending ? labels.durationLoading : !seconds && error ? labels.durationError : labels.durationHint;
  const isZero = parsePart(h, 24) === 0 && parsePart(m, 59) === 0;

  return (
    <div className="lms-duration-control" role="group" aria-labelledby={`${id}-label`}>
      <label id={`${id}-label`}>{labels.duration}</label>
      <input type="hidden" name="durationSeconds" value={seconds && seconds > 0 ? seconds : ""} aria-label="مدة الدرس بالثواني" readOnly />
      <div className="lms-duration-inputs">
        <div className="lms-duration-part">
          <label htmlFor={`${id}-h`}>{labels.hours}</label>
          <input id={`${id}-h`} type="number" min={0} max={24} step={1} dir="ltr" value={h} onChange={e => handleH(e.target.value)} onKeyDown={blockKey} onBlur={() => !h && setH("0")} required />
        </div>
        <div className="lms-duration-part">
          <label htmlFor={`${id}-m`}>{labels.minutes}</label>
          <input id={`${id}-m`} type="number" min={0} max={59} step={1} dir="ltr" value={m} onChange={e => handleM(e.target.value)} onKeyDown={blockKey} onBlur={() => !m && setM("0")} required />
        </div>
        <div className="lms-duration-part">
          <label htmlFor={`${id}-s`}>{labels.seconds}</label>
          <input id={`${id}-s`} type="number" min={isZero ? 1 : 0} max={59} step={1} dir="ltr" value={s} onChange={e => handleS(e.target.value)} onKeyDown={blockKey} onBlur={() => !s && setS("0")} required />
        </div>
      </div>
      {hintText && <small className="lms-field-hint">{hintText}</small>}
      {error && !seconds && onRetry && <button type="button" className="lms-text-link" onClick={onRetry}>{labels.retryDuration}</button>}
    </div>
  );
}
