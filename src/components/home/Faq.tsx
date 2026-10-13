"use client";

import { useState } from "react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="flex flex-col">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 py-6 text-left font-display text-[23px] font-medium text-ink hover:text-accent"
              >
                {f.q}
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center border font-sans text-xl transition-colors ${isOpen ? "border-accent bg-accent text-white" : "border-line text-ink"}`} aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen ? (
              <p id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="animate-fade-up mb-5 max-w-[720px] text-ink-soft">
                {f.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
