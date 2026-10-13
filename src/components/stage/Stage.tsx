"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/photos";
import { Picture } from "./Picture";
import { useStage } from "./StageContext";

/**
 * The fixed half of the split stage (desktop). One photograph fills it;
 * it crossfades to whichever photo belongs to the section being read.
 * Sections opt in with data-stage="<photo key>".
 */
export function Stage({ keys }: { keys: string[] }) {
  const { sectionPhoto, setSectionPhoto, hoverPhoto } = useStage();
  const current = hoverPhoto ?? sectionPhoto;
  const latest = useRef(setSectionPhoto);
  latest.current = setSectionPhoto;

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        // The section crossing the middle of the screen owns the stage.
        for (const e of entries) {
          if (e.isIntersecting) {
            const k = (e.target as HTMLElement).dataset.stage;
            if (k && k !== "keep") latest.current(k);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const shown = keys.filter((k) => photos[k]);
  return (
    <div className="sticky top-0 h-svh p-5" aria-hidden="true">
      <div className="relative h-full w-full overflow-hidden">
        {shown.map((k) => (
          <div
            key={k}
            className={`stage-photo absolute inset-0 ${k === current ? "is-on" : ""}`}
          >
            <Picture k={k} className="h-full w-full" sizes="47vw" priority={k === "house"} />
          </div>
        ))}
      </div>
    </div>
  );
}
