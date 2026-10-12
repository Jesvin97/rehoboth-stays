"use client";

import { useState } from "react";
import { places } from "@/lib/content";
import { site } from "@/lib/site";

export function AroundUs() {
  const [active, setActive] = useState(0);
  const p = places[active];
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">Around us</p>
        <h2 className="h2">A base for exploring {site.region}</h2>
        <p className="text-ink-soft">Tap a place to see it on the map.</p>
        <div className="flex flex-col gap-1">
          {places.map((pl, i) => (
            <button
              key={pl.name}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`flex min-h-[52px] items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-colors ${
                i === active ? "border-teal bg-white" : "border-transparent hover:bg-[#e2e9e3]"
              }`}
            >
              <span className="font-semibold">{pl.name}</span>
              <span className="whitespace-nowrap text-muted">{pl.time}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-[460px] flex-col justify-between rounded-2xl bg-sage p-5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#2e4238]">[Embedded Google Map]</span>
        <div key={active} className="animate-fade-up flex flex-col gap-1.5 rounded-xl bg-white p-4">
          <strong className="text-[17px]">{p.name}</strong>
          <span className="text-sm text-muted">{p.time} by car from the homestay · {p.note}</span>
          <a href={site.social.maps} className="text-sm font-semibold">Get directions →</a>
        </div>
      </div>
    </div>
  );
}
