"use client";

import { useState } from "react";
import { experiences } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { Picture } from "../stage/Picture";
import { useStage } from "../stage/StageContext";

/**
 * Experiences as one plate: tabs, a title, a short description, two actions.
 * On desktop the fixed photograph beside it changes with the tab.
 */
export function ExperienceShowcase() {
  const { setSectionPhoto } = useStage();
  const [active, setActive] = useState(0);
  const [wanted, setWanted] = useState<string[]>([]);
  const e = experiences[active];
  const on = wanted.includes(e.id);
  const pick = (i: number) => {
    setActive(i);
    setSectionPhoto(`exp-${experiences[i].id}`);
  };
  const message = wanted.length
    ? `Hello! We'd like to add these to our stay: ${experiences.filter((x) => wanted.includes(x.id)).map((x) => x.short).join(", ")}.`
    : `Hello! Could you tell me more about "${e.short}"?`;

  return (
    <section id="experiences" data-stage={`exp-${e.id}`} className="flex min-h-[88svh] flex-col justify-between gap-12 bg-mist px-5 py-24 lg:pl-[12%] lg:pr-10">
      <div role="tablist" aria-label="Experiences" data-reveal className="flex flex-wrap gap-x-7 gap-y-2">
        {experiences.map((x, i) => (
          <button
            key={x.id}
            id={`exp-tab-${x.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="exp-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => pick(i)}
            onKeyDown={(ev) => {
              if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
              ev.preventDefault();
              const n = (i + (ev.key === "ArrowRight" ? 1 : -1) + experiences.length) % experiences.length;
              pick(n);
              document.getElementById(`exp-tab-${experiences[n].id}`)?.focus();
            }}
            className={`min-h-11 text-[18px] transition-colors duration-200 ${i === active ? "text-ink underline decoration-accent decoration-2 underline-offset-[10px]" : "text-muted hover:text-ink"}`}
          >
            {x.short}
          </button>
        ))}
      </div>

      <div id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${e.id}`} className="flex flex-col gap-8">
        <Picture k={`exp-${e.id}`} className="aspect-square w-full lg:hidden" />
        <div key={e.id} className="swap-in max-w-[34ch]">
          <h2 className="font-display text-[clamp(2rem,1.3rem+2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">{e.short}</h2>
          <p className="mt-6 text-[18px] text-ink">{e.description}</p>
          <p className="mt-3 text-[14px] text-muted">{e.meta}</p>
        </div>
      </div>

      <div data-reveal className="grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setWanted((w) => (on ? w.filter((x) => x !== e.id) : [...w, e.id]))}
          className="press min-h-[72px] bg-ink px-5 text-left text-[18px] text-paper transition-[transform,background-color] duration-150 hover:bg-[#2b3d33] max-sm:min-h-[60px]"
        >
          {on ? "Added to your stay" : "Add to your stay"}
          {wanted.length ? <span className="block text-[14px] text-sage">{wanted.length} chosen so far</span> : null}
        </button>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noreferrer"
          className="press flex min-h-[72px] flex-col justify-center bg-sage px-5 text-[18px] text-ink no-underline transition-[transform,background-color] duration-150 hover:bg-[#bcc8be] hover:text-ink max-sm:min-h-[60px]"
        >
          {wanted.length ? "Send your list to the hosts" : "Ask the hosts about it"}
          <span className="text-[14px] text-ink-soft">Opens WhatsApp</span>
        </a>
      </div>
    </section>
  );
}
