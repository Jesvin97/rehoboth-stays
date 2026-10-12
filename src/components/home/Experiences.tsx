"use client";

import { useState } from "react";
import { experiences } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { Photo } from "../ui/Photo";

export function Experiences() {
  const [active, setActive] = useState(0);
  const [wanted, setWanted] = useState<string[]>([]);
  const e = experiences[active];
  const isWanted = wanted.includes(e.id);

  function onKeyDown(ev: React.KeyboardEvent) {
    if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
    ev.preventDefault();
    const next = (active + (ev.key === "ArrowRight" ? 1 : -1) + experiences.length) % experiences.length;
    setActive(next);
    document.getElementById(`exp-tab-${next}`)?.focus();
  }

  const message = wanted.length
    ? `Hi! We'd like to add these to our stay: ${experiences.filter((x) => wanted.includes(x.id)).map((x) => x.tab).join(", ")}.`
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Experiences" className="flex flex-wrap gap-1 border-b border-line" onKeyDown={onKeyDown}>
        {experiences.map((x, i) => (
          <button
            key={x.id}
            id={`exp-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="exp-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px min-h-12 border-b-[3px] px-4 font-semibold transition-colors ${
              i === active ? "border-teal text-teal" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {x.tab}
          </button>
        ))}
      </div>
      <div id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${active}`} key={e.id} className="animate-fade-up grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="group overflow-hidden rounded-2xl">
          <Photo label={e.tab} className="h-[340px] md:h-[380px]" zoom />
        </div>
        <div className="flex flex-col gap-3.5">
          <span className="text-sm font-semibold text-muted">{e.meta}</span>
          <h3 className="font-display text-[34px] font-bold leading-[1.1]">{e.title}</h3>
          <p className="text-[17px] text-ink-soft">{e.description}</p>
          <div className="flex flex-wrap gap-3 pt-1.5">
            <button
              type="button"
              aria-pressed={isWanted}
              onClick={() => setWanted((w) => (isWanted ? w.filter((id) => id !== e.id) : [...w, e.id]))}
              className={`min-h-12 rounded-full border-[1.5px] border-teal px-5 font-semibold transition-colors ${isWanted ? "bg-teal text-white" : "bg-white text-teal hover:bg-teal-tint"}`}
            >
              {isWanted ? "✓ Added to my wishlist" : "+ Add to my wishlist"}
            </button>
            {wanted.length ? (
              <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="inline-flex items-center font-semibold">
                Send {wanted.length} to your host on WhatsApp →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
