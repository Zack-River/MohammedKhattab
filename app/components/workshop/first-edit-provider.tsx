"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EditRhythm } from "@/app/data/first-edit";

interface FirstEditState {
  rhythm: EditRhythm;
  chosen: boolean;
  choose: (rhythm: EditRhythm) => void;
}
const FirstEditContext = createContext<FirstEditState | null>(null);

export default function FirstEditProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selection, setSelection] = useState<{
    rhythm: EditRhythm;
    chosen: boolean;
  }>({ rhythm: "calm", chosen: false });
  const value = useMemo(
    () => ({
      ...selection,
      choose: (rhythm: EditRhythm) => setSelection({ rhythm, chosen: true }),
    }),
    [selection],
  );
  return (
    <FirstEditContext.Provider value={value}>
      {children}
    </FirstEditContext.Provider>
  );
}
export function useFirstEdit() {
  const state = useContext(FirstEditContext);
  if (!state)
    throw new Error("First edit components require FirstEditProvider");
  return state;
}
