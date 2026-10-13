"use client";

import { useState } from "react";
import type { Room } from "@/lib/rooms";
import { ChevronLeft, ChevronRight } from "../ui/Icons";
import { Photo } from "../ui/Photo";

export function RoomGallery({ room }: { room: Room }) {
  const [i, setI] = useState(0);
  const n = room.photos.length;
  const go = (k: number) => setI((k + n) % n);
  const arrow = "absolute top-1/2 -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:bg-mist";

  return (
    <div className="flex flex-col gap-2.5" aria-roledescription="carousel" aria-label={`${room.name} photos`}>
      <div className="relative">
        <Photo key={i} label={room.photos[i].label} src={room.photos[i].src} tone={room.photos[i].tone} sizes="(max-width: 1280px) 100vw, 1280px" priority={i === 0} align="start" className="animate-fade-up h-[300px] rounded-[3px] sm:h-[480px]" />
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className={`${arrow} left-4`}><ChevronLeft size={18} /></button>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className={`${arrow} right-4`}><ChevronRight size={18} /></button>
        <span className="absolute bottom-4 right-4 rounded-full bg-[rgba(20,30,25,0.75)] px-3 py-1.5 text-sm font-semibold text-white">{i + 1} / {n}</span>
      </div>
      <div className="grid grid-cols-5 gap-2.5">
        {room.photos.map((p, k) => (
          <button
            key={p.label}
            type="button"
            onClick={() => go(k)}
            aria-label={`Show ${p.label}`}
            aria-current={k === i}
            className={`overflow-hidden rounded-xl border-[3px] transition-[opacity,border-color] ${k === i ? "border-accent opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Photo label={p.label} src={p.src} tone={p.tone} sizes="200px" className="h-[60px] text-[10px] sm:h-[84px] [&>div]:p-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
