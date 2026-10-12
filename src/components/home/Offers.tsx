"use client";

import { useEffect, useRef, useState } from "react";
import { coupons } from "@/lib/pricing";

const badges: Record<string, string> = { DIRECT10: "Direct booking", EARLY30: "Early bird", STAY5: "Long stay" };

export function Offers() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked — still show the code */
    }
    setCopied(code);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((c) => (
        <div key={c.code} className="lift flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-6">
          <span className="self-start rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-sand-ink">{badges[c.code]}</span>
          <strong className="font-display text-[23px] leading-tight">{c.title}</strong>
          <span className="flex-1 text-muted">
            {c.minNights > 1 ? `For stays of ${c.minNights}+ nights. ` : ""}Apply the code at checkout.
          </span>
          <div className="mt-1.5 flex items-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-[#a9b8ad] py-1.5 pl-3 pr-1.5">
            <code className="flex-1 text-sm font-bold">{c.code}</code>
            <button
              type="button"
              onClick={() => copy(c.code)}
              className={`min-h-9 rounded-lg px-3 text-sm font-semibold text-white transition-colors ${copied === c.code ? "bg-[#2e7d4f]" : "bg-teal hover:bg-teal-dark"}`}
            >
              {copied === c.code ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
