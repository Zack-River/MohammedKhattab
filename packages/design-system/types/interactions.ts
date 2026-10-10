export interface CountdownOptions {
  endsAt: string | null;
  durationSeconds: number;
  storageKey: string;
  tickMs: number;
}
export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";
export interface CountdownContent {
  label: string;
  accessibleLabel: string;
  units: readonly { key: CountdownUnit; label: string }[];
}
export interface SignupOptions {
  names: readonly string[];
  initialName: string;
  delayMs: number;
  visibleMs: number;
  intervalMs: number;
}
export interface SignupContent {
  status: string;
  closeLabel: string;
}
export interface RevealGroup {
  trigger: string;
  target?: string;
  children?: boolean;
  x?: number;
  y?: number;
  scale?: number;
  duration: number;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}
export interface RevealOptions {
  viewportThreshold: number;
  easing: string;
  groups: readonly RevealGroup[];
}
