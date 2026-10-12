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
                className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink"
              >
                {f.q}
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl transition-colors ${isOpen ? "bg-teal text-white" : "bg-mist text-ink"}`} aria-hidden="true">
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
