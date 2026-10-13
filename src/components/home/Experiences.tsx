"use client";

import { useState } from "react";
import { experiences } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { Photo } from "../ui/Photo";

const tones = ["#7f9784", "#8c8a6b", "#6f8b8a", "#93876d"];

/** "Explore more" — Taj-style image tiles. Guests can build a wishlist to send the host. */
export function Experiences() {
  const [wanted, setWanted] = useState<string[]>([]);
  const toggle = (id: string) => setWanted((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const message = wanted.length
    ? `Hi! We'd like to add these to our stay: ${experiences.filter((x) => wanted.includes(x.id)).map((x) => x.tab).join(", ")}.`
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {experiences.map((e, i) => {
          const on = wanted.includes(e.id);
          return (
            <article key={e.id} className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden text-white">
              <Photo label={e.tab} tone={tones[i % tones.length]} dark align="start" className="absolute inset-0" zoom />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,20,0)_35%,rgba(15,24,20,0.85)_100%)]" aria-hidden="true" />
              <div className="relative flex flex-col gap-3 p-6">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-light">{e.meta}</span>
                <h3 className="font-display text-[28px] font-medium leading-tight">{e.title}</h3>
                <p className="max-h-0 overflow-hidden text-[15px] text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 group-focus-within:max-h-40 group-focus-within:opacity-100 max-lg:max-h-40 max-lg:opacity-100">
                  {e.description}
                </p>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(e.id)}
                  className={`mt-1 inline-flex min-h-11 items-center justify-center self-start border px-5 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    on ? "border-gold-deep bg-gold-deep text-white" : "border-white/70 text-white hover:bg-white hover:text-ink"
                  }`}
                >
                  {on ? "✓ In my wishlist" : "+ Add to wishlist"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className={`flex flex-wrap items-center justify-center gap-4 text-center transition-opacity ${wanted.length ? "opacity-100" : "opacity-70"}`} aria-live="polite">
        {wanted.length ? (
          <>
            <span className="text-ink-soft">{wanted.length} {wanted.length === 1 ? "experience" : "experiences"} in your wishlist</span>
            <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="btn-primary">Send to your host on WhatsApp</a>
          </>
        ) : (
          <span className="text-muted">Add experiences to your wishlist and your host will plan them before you arrive.</span>
        )}
      </div>
    </div>
  );
}
