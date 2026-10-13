"use client";

import Link from "next/link";
import type { Room } from "@/lib/rooms";
import { inr } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Photo } from "../ui/Photo";
import { Heart } from "../ui/Icons";

/** Room card: Taj-style image and serif title, Voye-style badges and facts. */
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
  const maxGuests = room.maxAdults + room.maxChildren;
  return (
    <article className="group lift animate-fade-up flex flex-col overflow-hidden bg-white shadow-[0_1px_0_var(--color-line)]">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Photo label={room.photos[0].label} src={room.photos[0].src} tone={room.photos[0].tone} className="aspect-[3/2]" zoom />
        </Link>
        <span className="absolute left-0 top-4 bg-white/95 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
          {site.region.split(",")[0]}
        </span>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${room.name} from saved` : `Save ${room.name}`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-rust shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
        >
          <Heart filled={saved} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-1.5">
          {room.badges.map((b) => (
            <span key={b} className="rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] text-accent-dark">{b}</span>
          ))}
        </div>
        <h3 className="font-display text-[28px] font-medium leading-tight">
          <Link href={href} className="text-ink no-underline hover:text-accent">{room.name}</Link>
        </h3>
        <p className="text-[15px] text-ink-soft">{room.tagline}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] uppercase tracking-[0.12em] text-muted">
          <li>Up to {maxGuests} guests</li>
          <li>{room.bedrooms} {room.bedrooms === 1 ? "bedroom" : "bedrooms"}</li>
          <li>{room.sizeSqft} sq ft</li>
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line-soft pt-4">
          <span className="whitespace-nowrap">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-muted">From</span>
            <strong className="font-display text-[26px] font-semibold leading-none">{inr(room.rates.bb)}</strong>
            <span className="text-[13px] text-muted"> / night</span>
          </span>
          <Link href={href} className="btn-outline min-h-11 whitespace-nowrap px-5">View details</Link>
        </div>
      </div>
    </article>
  );
}
