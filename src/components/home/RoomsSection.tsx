"use client";

import { useEffect, useState } from "react";
import { roomFilters } from "@/lib/content";
import { rooms } from "@/lib/rooms";
import { RoomCard } from "../rooms/RoomCard";

type FilterId = (typeof roomFilters)[number]["id"];
const SAVED_KEY = "rehoboth:saved-rooms";

export function useSavedRooms() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* storage unavailable */
    }
  }, []);
  const toggle = (slug: string) =>
    setSaved((s) => {
      const next = s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug];
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  return { saved, toggle };
}

export function RoomsSection({ query = "", centered = false }: { query?: string; centered?: boolean }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const { saved, toggle } = useSavedRooms();
  const list = rooms.filter((r) => filter === "all" || r.tags.includes(filter));

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Filter rooms" className={`flex flex-wrap gap-x-8 gap-y-2 border-b border-line ${centered ? "justify-center" : ""}`}>
        {roomFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`-mb-px min-h-12 border-b-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors ${
              filter === f.id ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {list.map((r) => (
          <RoomCard key={r.slug} room={r} query={query} saved={saved.includes(r.slug)} onToggleSave={() => toggle(r.slug)} />
        ))}
      </div>
      <p className={`text-sm text-muted ${centered ? "text-center" : ""}`} aria-live="polite">
        {saved.length ? `♥ ${saved.length} ${saved.length === 1 ? "room" : "rooms"} saved for later` : "Tap the heart to save a room for later."}
      </p>
    </div>
  );
}
