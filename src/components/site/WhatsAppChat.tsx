"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { Chat, Close } from "../ui/Icons";

const quick = ["Are you free on my dates?", "Can you pick us up from the airport?", "What would 4 nights for a family cost?"];

export function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-sm:bottom-24">
      {open ? (
        <div role="dialog" aria-label="Chat with the host" className="animate-pop w-[320px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[3px] bg-white shadow-[0_18px_44px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 bg-accent p-4 text-white">
            <div className="h-10 w-10 shrink-0 rounded-full bg-[#a9c7c1]" aria-hidden="true" />
            <div className="flex-1">
              <strong>{site.hostFirstName}</strong>
              <div className="text-[13px] opacity-90">Usually replies within an hour</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Close size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-2.5 bg-[#f1f4f1] p-4">
            <div className="max-w-[85%] self-start rounded-[4px_14px_14px_14px] bg-white px-3 py-2.5 text-[15px]">
              Namaskaram! How can we help plan your stay?
            </div>
            {picked ? (
              <div className="animate-fade-up max-w-[85%] self-end rounded-[14px_4px_14px_14px] bg-[#d3ebe6] px-3 py-2.5 text-[15px]">{picked}</div>
            ) : null}
            <div className="flex flex-col gap-1.5 pt-1">
              {quick.map((q) => (
                <button key={q} type="button" onClick={() => setPicked(q)} className="min-h-[38px] rounded-full border border-accent bg-white px-3.5 text-left text-sm text-accent hover:bg-accent-tint">
                  {q}
                </button>
              ))}
            </div>
            <a href={whatsappLink(picked || undefined)} target="_blank" rel="noreferrer" className="mt-1 rounded-[3px] bg-accent p-3 text-center font-semibold text-white no-underline hover:bg-accent-dark">
              Continue in WhatsApp
            </a>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-accent text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-colors hover:bg-accent-dark"
      >
        <Chat size={26} />
      </button>
    </div>
  );
}
