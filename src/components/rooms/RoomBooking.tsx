"use client";

import Link from "next/link";
import { useState } from "react";
import { plans, type Room } from "@/lib/rooms";
import { addOns, inr, quote } from "@/lib/pricing";
import { addDays, nightsBetween, todayIST } from "@/lib/dates";
import { selectionQuery, type BookingSelection } from "@/lib/booking-params";
import { cancellationSchedule } from "@/lib/cancellation";
import { formatShort } from "@/lib/dates";
import { Stepper } from "../ui/Stepper";

/**
 * Left column: rate plans + add-ons. Right column: live price card.
 * Both share one selection, so this component renders the two-column body.
 */
export function RoomBooking({ room, initial, children }: { room: Room; initial: BookingSelection; children: React.ReactNode }) {
  const [sel, setSel] = useState<BookingSelection>({
    ...initial,
    adults: Math.min(initial.adults, room.maxAdults),
    children: Math.min(initial.children, room.maxChildren),
  });
  const set = (patch: Partial<BookingSelection>) => setSel((s) => ({ ...s, ...patch }));
  const q = quote({ roomSlug: room.slug, plan: sel.plan, checkIn: sel.checkIn, checkOut: sel.checkOut, adults: sel.adults, children: sel.children, addOns: sel.addOns });
  const today = todayIST();
  const policy = cancellationSchedule(today);

  return (
    <div className="flex flex-wrap items-start gap-12">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-10">
        {children}

        <section className="flex flex-col gap-4 border-t border-line-soft pt-8" aria-labelledby="plans-h">
          <h2 id="plans-h" className="font-display text-[26px] font-medium">Choose a rate plan</h2>
          <div role="radiogroup" aria-labelledby="plans-h" className="flex flex-col gap-3">
            {plans.map((p) => {
              const on = sel.plan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set({ plan: p.id })}
                  className={`lift flex flex-wrap items-center justify-between gap-3.5 rounded-[3px] border-2 px-5 py-4 text-left ${on ? "border-accent bg-accent-wash" : "border-line bg-white"}`}
                >
                  <span className="flex items-center gap-3.5">
                    <span className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-accent" : "border-[#a9b8ad]"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${on ? "bg-accent" : ""}`} />
                    </span>
                    <span>
                      <strong>{p.name}</strong>
                      <span className="block text-sm text-muted">{p.detail}</span>
                    </span>
                  </span>
                  <strong className="text-xl">
                    {inr(room.rates[p.id])}
                    <span className="text-sm font-normal text-muted"> / night</span>
                  </strong>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted">
            Paid in full when you book. Cancellation is counted from your booking date — 50% refund within 2 days, 25% until day 4, then no refund.{" "}
            <Link href="/policies">Full policy</Link>
          </p>
        </section>

        <section className="flex flex-col gap-4 border-t border-line-soft pt-8" aria-labelledby="addons-h">
          <h2 id="addons-h" className="font-display text-[26px] font-medium">Add to your stay</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {addOns.map((a) => {
              const on = sel.addOns.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ addOns: on ? sel.addOns.filter((x) => x !== a.id) : [...sel.addOns, a.id] })}
                  className={`lift flex flex-col gap-1.5 rounded-[3px] border-2 p-4 text-left ${on ? "border-accent bg-accent-wash" : "border-line bg-white"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <strong>{a.name}</strong>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm text-white ${on ? "border-accent bg-accent" : "border-[#a9b8ad] bg-white"}`}>{on ? "✓" : ""}</span>
                  </span>
                  <span className="text-sm text-muted">+ {inr(a.price)} · {a.unit}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <aside aria-label="Book this room" className="sticky top-24 flex w-full max-w-[420px] flex-[1_1_340px] flex-col gap-4 rounded-[3px] border border-line bg-white p-6 shadow-[0_8px_28px_rgba(28,43,36,0.08)]">
        <div>
          <strong className="font-display text-[28px]">{inr(room.rates[sel.plan])}</strong>
          <span className="text-muted"> / night · {plans.find((p) => p.id === sel.plan)?.name}</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          <label className="field-label">
            Check-in
            <input
              className="field"
              type="date"
              min={today}
              value={sel.checkIn}
              onChange={(e) => {
                const v = e.target.value;
                set({ checkIn: v, checkOut: nightsBetween(v, sel.checkOut) < 1 ? addDays(v, 1) : sel.checkOut });
              }}
            />
          </label>
          <label className="field-label">
            Check-out
            <input className="field" type="date" min={addDays(sel.checkIn, 1)} value={sel.checkOut} onChange={(e) => set({ checkOut: e.target.value })} />
          </label>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-line px-3.5 py-3">
          <Stepper label="Adults" hint={`Up to ${room.maxAdults}`} value={sel.adults} min={1} max={room.maxAdults} onChange={(v) => set({ adults: v })} />
          <Stepper label="Children" hint="Under 12" value={sel.children} min={0} max={room.maxChildren} onChange={(v) => set({ children: v })} />
        </div>

        {q.ok ? (
          <div className="flex flex-col gap-2 border-t border-line-soft pt-3.5 text-[15px] text-ink-soft">
            <div className="flex justify-between"><span>{inr(q.nightlyRate)} × {q.nights} {q.nights === 1 ? "night" : "nights"}</span><span>{inr(q.roomTotal)}</span></div>
            {q.extraAdultTotal ? <div className="flex justify-between"><span>Extra adult × {q.nights}</span><span>{inr(q.extraAdultTotal)}</span></div> : null}
            {q.addOnTotal ? <div className="flex justify-between"><span>Add-ons ({q.addOnLines.length})</span><span>{inr(q.addOnTotal)}</span></div> : null}
            <div className="flex justify-between"><span>GST</span><span>{inr(q.gst)}</span></div>
            <div className="flex justify-between pt-1.5 text-lg font-bold text-ink"><span>Total</span><span>{inr(q.total)}</span></div>
            <p className="text-[13px] text-muted">Have a coupon? Apply it at checkout.</p>
          </div>
        ) : (
          <p role="alert" className="rounded-[3px] bg-error-bg px-3 py-2.5 text-sm text-error-ink">{q.error}</p>
        )}

        {q.ok ? (
          <Link href={`/book?${selectionQuery(sel)}`} className="btn-primary min-h-[52px] rounded-xl no-underline">
            Reserve now
          </Link>
        ) : (
          <button type="button" disabled className="btn-primary min-h-[52px] rounded-xl">Reserve now</button>
        )}
        <p className="text-center text-[13px] text-muted">
          Full payment at booking · secured by Razorpay
          <br />
          Book today: 50% refund until {formatShort(policy.fiftyUntil)}
        </p>
      </aside>
    </div>
  );
}
