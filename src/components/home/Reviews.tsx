"use client";

import { useState } from "react";
import { reviews } from "@/lib/content";
import { site } from "@/lib/site";
import { ChevronLeft, ChevronRight } from "../ui/Icons";

export function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const arrow = "flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-teal bg-white text-teal hover:bg-teal-tint";
  return (
    <div className="mx-auto flex max-w-[960px] flex-col items-center gap-8 text-center">
      <p className="eyebrow">Guest stories</p>
      <div className="text-xl font-bold tracking-[0.14em] text-[#8a5d0e]" aria-label={`Rated ${site.rating} out of 5`}>★★★★★</div>
      <figure key={i} className="animate-fade-up flex min-h-[180px] flex-col justify-center gap-4" aria-live="polite">
        <blockquote className="font-display text-[clamp(22px,2.6vw,32px)] font-medium leading-snug">{r.text}</blockquote>
        <figcaption className="text-muted">{r.who} · via {r.source}</figcaption>
      </figure>
      <div className="flex items-center gap-4">
        <button type="button" className={arrow} onClick={() => setI((i - 1 + reviews.length) % reviews.length)} aria-label="Previous review">
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-12 font-semibold">{i + 1} / {reviews.length}</span>
        <button type="button" className={arrow} onClick={() => setI((i + 1) % reviews.length)} aria-label="Next review">
          <ChevronRight size={18} />
        </button>
      </div>
      <a href={site.social.maps} className="text-sm font-semibold">Read all {site.reviewCount} reviews on Google</a>
    </div>
  );
}
