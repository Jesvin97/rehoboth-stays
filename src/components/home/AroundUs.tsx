"use client";

import { useState } from "react";
import { places } from "@/lib/content";
import { site } from "@/lib/site";

export function AroundUs() {
  const [active, setActive] = useState(0);
  const p = places[active];
  return (
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-5">
        <h2 className="h2">A base for exploring {site.region}</h2>
        <div className="ornament justify-start before:hidden" aria-hidden="true">✦</div>
        <p className="text-ink-soft">Choose a place to see how far it is from the home.</p>
        <ul className="flex flex-col border-t border-line">
          {places.map((pl, i) => (
            <li key={pl.name} className="border-b border-line">
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`flex min-h-[60px] w-full items-center justify-between gap-3 py-4 pl-4 pr-2 text-left transition-colors ${
                  i === active ? "border-l-2 border-accent bg-white" : "border-l-2 border-transparent hover:bg-white/60"
                }`}
              >
                <span className="font-display text-[22px] font-medium">{pl.name}</span>
                <span className="whitespace-nowrap text-[13px] text-muted">{pl.time}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-h-[480px] flex-col justify-between bg-sage p-6">
        <span className="text-[13px] font-medium text-ink-deep">[Embedded Google Map]</span>
        <div key={active} className="animate-fade-up flex flex-col gap-2 bg-white p-6 shadow-soft">
          <strong className="font-display text-[26px] font-medium">{p.name}</strong>
          <span className="text-muted">{p.time} by car from the homestay, {p.note}</span>
          <a href={site.social.maps} className="more-link mt-1">Get directions</a>
        </div>
      </div>
    </div>
  );
}
