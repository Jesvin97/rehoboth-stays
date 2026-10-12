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

export function RoomsSection({ query = "" }: { query?: string }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const { saved, toggle } = useSavedRooms();
  const list = rooms.filter((r) => filter === "all" || r.tags.includes(filter));

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter rooms" className="flex flex-wrap gap-2">
        {roomFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-10 rounded-full border-[1.5px] border-teal px-4 text-sm font-semibold transition-colors ${
              filter === f.id ? "bg-teal text-white" : "bg-white text-teal hover:bg-teal-tint"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6">
        {list.map((r) => (
          <RoomCard key={r.slug} room={r} query={query} saved={saved.includes(r.slug)} onToggleSave={() => toggle(r.slug)} />
        ))}
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        {saved.length ? `♥ ${saved.length} ${saved.length === 1 ? "room" : "rooms"} saved for later` : "Tap the heart to save a room for later."}
      </p>
    </div>
  );
}
