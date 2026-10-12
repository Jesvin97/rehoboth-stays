"use client";

import Link from "next/link";
import type { Room } from "@/lib/rooms";
import { inr } from "@/lib/pricing";
import { Photo } from "../ui/Photo";
import { Heart } from "../ui/Icons";

export function RoomCard({
  room,
  query,
  saved,
  onToggleSave,
}: {
  room: Room;
  query?: string;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const href = `/rooms/${room.slug}${query ? `?${query}` : ""}`;
  return (
    <article className="lift group animate-fade-up flex flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Photo label={room.photos[0].label} tone={room.photos[0].tone} className="h-[220px]" zoom />
        </Link>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${room.name} from saved` : `Save ${room.name}`}
          className="absolute right-3 top-3 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-rust shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
        >
          <Heart filled={saved} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-[22px] font-bold">
          <Link href={href} className="text-ink no-underline hover:text-teal">{room.name}</Link>
        </h3>
        <p className="text-sm text-muted">{room.chips.slice(0, 3).join(" · ")}</p>
        <p className="text-[15px] text-ink-soft">{room.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span>
            <span className="text-[13px] text-muted">from </span>
            <strong className="text-[19px]">{inr(room.rates.bb)}</strong>
            <span className="text-[13px] text-muted"> / night</span>
          </span>
          <Link href={href} className="font-semibold">View room →</Link>
        </div>
      </div>
    </article>
  );
}
