"use client";

import { useEffect, useRef, useState } from "react";
import { coupons } from "@/lib/pricing";
import { ChevronLeft, ChevronRight } from "../ui/Icons";
import { Photo } from "../ui/Photo";

const extra: Record<string, { badge: string; label: string; tone: string }> = {
  DIRECT10: { badge: "Book direct", label: "Verandah at dusk", tone: "#b8c6bc" },
  EARLY30: { badge: "Early bird", label: "Monsoon over the estate", tone: "#c3cdb7" },
  STAY5: { badge: "Long stay", label: "Work desk by the window", tone: "#bfcbc9" },
};

/** "Exclusively for you" — horizontal offers carousel with copyable codes. */
export function Offers() {
  const track = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked — the code is still visible */
    }
    setCopied(code);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  }

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  };

  const arrow = "flex h-12 w-12 items-center justify-center border border-line bg-white text-ink transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Offers</p>
          <h2 className="h2">Exclusively for you</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label="Previous offers"><ChevronLeft size={18} /></button>
          <button type="button" className={arrow} onClick={() => scroll(1)} aria-label="More offers"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div ref={track} className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
        {coupons.map((c) => {
          const x = extra[c.code];
          return (
            <article key={c.code} className="group flex w-[min(84vw,400px)] shrink-0 snap-start flex-col bg-white shadow-[0_1px_0_var(--color-line)]">
              <div className="relative">
                <Photo label={x.label} tone={x.tone} className="aspect-[16/10]" zoom />
                <span className="absolute left-0 top-4 bg-gold-deep px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white">{x.badge}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-[26px] font-medium leading-tight">{c.title}</h3>
                <p className="flex-1 text-[15px] text-muted">
                  {c.minNights > 1 ? `For stays of ${c.minNights} nights or more. ` : ""}Apply the code at checkout.
                </p>
                <div className="flex items-center gap-3 border border-dashed border-line py-2 pl-4 pr-2">
                  <code className="flex-1 text-sm font-semibold tracking-[0.12em]">{c.code}</code>
                  <button
                    type="button"
                    onClick={() => copy(c.code)}
                    className={`min-h-10 px-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-colors ${copied === c.code ? "bg-[#2e7d4f]" : "bg-accent hover:bg-accent-dark"}`}
                  >
                    {copied === c.code ? "Copied ✓" : "Copy code"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        <article className="flex w-[min(84vw,400px)] shrink-0 snap-start flex-col justify-between gap-6 bg-forest p-8 text-white">
          <div className="flex flex-col gap-3">
            <span className="self-start bg-gold-deep px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white">Celebrations</span>
            <h3 className="font-display text-[30px] font-medium leading-tight">Honeymoons, anniversaries &amp; family reunions</h3>
            <p className="text-white/85">[Tell us the occasion — we&apos;ll plan the flowers, a candlelight dinner on the verandah, or take over the whole home for your group.]</p>
          </div>
          <a href="#callback" className="btn-light self-start">Plan with your host</a>
        </article>
      </div>
    </div>
  );
}
