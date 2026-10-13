"use client";

import { useState } from "react";
import { reviews } from "@/lib/content";
import { site } from "@/lib/site";
import { ChevronLeft, ChevronRight } from "../ui/Icons";

export function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const arrow = "flex h-12 w-12 items-center justify-center border border-line text-ink transition-colors hover:border-accent hover:text-accent";
  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-8 text-center">
      <p className="eyebrow">Guest stories</p>
      <div className="font-display text-[80px] leading-[0.5] text-gold" aria-hidden="true">&ldquo;</div>
      <figure key={i} className="animate-fade-up flex min-h-[200px] flex-col justify-center gap-6" aria-live="polite">
        <blockquote className="font-display text-[clamp(26px,3vw,40px)] font-medium italic leading-snug">{r.text}</blockquote>
        <figcaption className="text-[12px] uppercase tracking-[0.22em] text-muted">
          {r.who} · via {r.source}
        </figcaption>
      </figure>
      <div className="flex items-center gap-5">
        <button type="button" className={arrow} onClick={() => setI((i - 1 + reviews.length) % reviews.length)} aria-label="Previous review">
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-12 text-[13px] tracking-[0.2em] text-muted">{String(i + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span>
        <button type="button" className={arrow} onClick={() => setI((i + 1) % reviews.length)} aria-label="Next review">
          <ChevronRight size={18} />
        </button>
      </div>
      <a href={site.social.maps} className="more-link">Read all {site.reviewCount} reviews on Google ›</a>
    </div>
  );
}
