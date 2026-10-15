"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultStay } from "@/lib/dates";

export type StayState = { checkIn: string; checkOut: string; adults: number; children: number };

type Ctx = {
  /** Photo key chosen by the section currently in view. */
  sectionPhoto: string;
  setSectionPhoto: (k: string) => void;
  /** Temporary photo from hovering a room row. */
  hoverPhoto: string | null;
  setHoverPhoto: (k: string | null) => void;
  stay: StayState;
  setStay: (s: StayState) => void;
  ready: boolean;
};

const StageCtx = createContext<Ctx | null>(null);

export function StageProvider({ children }: { children: React.ReactNode }) {
  const [sectionPhoto, setSectionPhoto] = useState("house");
  const [hoverPhoto, setHoverPhoto] = useState<string | null>(null);
  // Dates come from the visitor's own "today" after load (the page is pre-built).
  const [stay, setStay] = useState<StayState>({ checkIn: "", checkOut: "", adults: 2, children: 0 });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setStay((s) => ({ ...s, ...defaultStay() }));
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({ sectionPhoto, setSectionPhoto, hoverPhoto, setHoverPhoto, stay, setStay, ready }),
    [sectionPhoto, hoverPhoto, stay, ready],
  );
  return <StageCtx.Provider value={value}>{children}</StageCtx.Provider>;
}

export function useStage() {
  const c = useContext(StageCtx);
  if (!c) throw new Error("useStage must be used inside StageProvider");
  return c;
}
