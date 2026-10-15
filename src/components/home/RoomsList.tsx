"use client";

import Link from "next/link";
import { rooms } from "@/lib/rooms";
import { inr, quote } from "@/lib/pricing";
import { nightsBetween } from "@/lib/dates";
import { selectionQuery } from "@/lib/booking-params";
import { photo } from "@/lib/photos";
import { useStage } from "../stage/StageContext";

const groups = [
  { label: "For two", slugs: ["heritage-room", "plantation-cottage"] },
  { label: "For families and groups", slugs: ["family-suite", "whole-home"] },
];

/**
 * The rooms as two-ended rows: name and facts on the left, the price for
 * the visitor's own dates on the right. Answers the hero's search live.
 * Prices shown here are for display; the server recalculates at checkout.
 */
export function RoomsList() {
  const { stay, ready, setHoverPhoto } = useStage();
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const guests = stay.adults + stay.children;

  return (
    <section id="rooms" data-stage="room-heritage-room" className="bg-paper px-5 pb-36 pt-36 lg:pl-[12%] lg:pr-10">
      <div className="max-w-[560px]">
        <h2 data-reveal className="font-display text-[clamp(2rem,1.3rem+2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Four rooms, one house
        </h2>
        <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-4 text-[18px] text-ink" aria-live="polite">
          {ready && nights >= 1
            ? `Prices below are for ${nights} ${nights === 1 ? "night" : "nights"}, ${guests} ${guests === 1 ? "guest" : "guests"}, with breakfast and GST.`
            : "Choose your dates above to see the price for your stay."}
        </p>

        <div className="room-index mt-12 flex flex-col gap-10">
          {groups.map((g, gi) => (
            <div key={g.label} data-reveal style={{ ["--i" as string]: gi + 2 }}>
              <p className="mb-3 text-[14px] text-muted">{g.label}</p>
              <ul className="flex flex-col">
                {g.slugs.map((slug) => {
                  const r = rooms.find((x) => x.slug === slug)!;
                  const fits = stay.adults <= r.maxAdults && stay.children <= r.maxChildren;
                  const q = ready && fits ? quote({ roomSlug: r.slug, plan: "bb", checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children, addOns: [] }) : null;
                  const sel = { ...stay, room: r.slug, plan: "bb" as const, addOns: [] };
                  const href = `/rooms/${r.slug}?${selectionQuery(sel)}`;
                  const key = `room-${r.slug}`;
                  return (
                    <li
                      key={r.slug}
                      className="room-row"
                      onMouseEnter={() => setHoverPhoto(key)}
                      onMouseLeave={() => setHoverPhoto(null)}
                      onFocus={() => setHoverPhoto(key)}
                      onBlur={() => setHoverPhoto(null)}
                    >
                      <div className="flex items-start justify-between gap-6 py-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-[7px] h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: photo(key).tone }} aria-hidden="true" />
                          <div className="min-w-0">
                            <Link href={href} className="link-quiet text-[18px] font-medium text-ink hover:text-accent">
                              {r.name}
                            </Link>
                            <p className="text-[14px] text-muted">
                              {r.bed} · up to {r.maxAdults} adults{r.maxChildren ? ` and ${r.maxChildren} ${r.maxChildren === 1 ? "child" : "children"}` : ""} · {r.view.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          {!fits ? (
                            <p className="text-[14px] text-muted">Too small for {guests}</p>
                          ) : q && q.ok ? (
                            <>
                              <p key={`${q.total}`} className="price-tick text-[18px] tabular-nums text-ink">{inr(q.total)}</p>
                              <Link href={`/book?${selectionQuery(sel)}`} className="link-quiet text-[14px] text-accent">
                                Reserve
                              </Link>
                            </>
                          ) : (
                            <p className="text-[14px] tabular-nums text-muted">from {inr(r.rates.bb)} a night</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-12 text-[18px] text-ink">
          Every room is paid in full when you book. If plans change, you get half back within two days of booking and a quarter until day four.{" "}
          <Link href="/policies#cancellation" className="link-quiet text-accent">The full policy</Link>
        </p>
      </div>
    </section>
  );
}
