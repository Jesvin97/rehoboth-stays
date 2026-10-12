"use client";

import { useState } from "react";
import type { Room } from "@/lib/rooms";
import { coupons, couponDiscount, inr, type Quote } from "@/lib/pricing";
import { formatShort } from "@/lib/dates";
import { site } from "@/lib/site";
import { Photo } from "../ui/Photo";

export function PriceSummary({
  room,
  planName,
  checkIn,
  checkOut,
  guestLabel,
  q,
  coupon,
  onCoupon,
}: {
  room: Room;
  planName: string;
  checkIn: string;
  checkOut: string;
  guestLabel: string;
  q: Quote | null;
  coupon: string | null;
  onCoupon: (code: string | null) => void;
}) {
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState("");
  const nights = q?.nights ?? 0;
  const roomCost = q ? q.roomTotal + q.extraAdultTotal : 0;

  function apply(code: string) {
    if (!code.trim()) return;
    const c = coupons.find((x) => x.code === code.trim().toUpperCase());
    if (!c) return setErr("That code isn't valid.");
    if (nights < c.minNights) return setErr(`${c.code} needs at least ${c.minNights} nights.`);
    setErr("");
    setTyped("");
    onCoupon(c.code);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="card gap-4">
        <div className="flex items-center gap-3.5">
          <Photo label={room.photos[0].label} tone={room.photos[0].tone} className="h-[86px] w-[110px] shrink-0 rounded-xl text-[10px] [&>div]:p-2" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] text-muted">Homestay · {site.region}</span>
            <strong className="text-lg">{room.name}</strong>
            <span className="text-sm text-ink-soft">{planName}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-line-soft pt-3.5 text-[15px]">
          <div className="flex justify-between gap-3"><span className="text-muted">Dates</span><span>{formatShort(checkIn)} – {formatShort(checkOut)}</span></div>
          <div className="flex justify-between gap-3"><span className="text-muted">Guests</span><span className="text-right">{guestLabel}</span></div>
        </div>

        {q ? (
          <div className="flex flex-col gap-2 border-t border-line-soft pt-3.5 text-[15px] text-ink-soft">
            <strong className="text-base text-ink">Price details</strong>
            <div className="flex justify-between"><span>{inr(q.nightlyRate)} × {q.nights} {q.nights === 1 ? "night" : "nights"}</span><span>{inr(q.roomTotal)}</span></div>
            {q.extraAdultTotal ? <div className="flex justify-between"><span>Extra adult{q.extraAdults > 1 ? `s (${q.extraAdults})` : ""} × {q.nights}</span><span>{inr(q.extraAdultTotal)}</span></div> : null}
            {q.addOnLines.map((a) => (
              <div key={a.id} className="flex justify-between"><span>{a.name}</span><span>{inr(a.price)}</span></div>
            ))}
            {q.coupon ? <div className="flex justify-between text-teal"><span>Coupon {q.coupon.code}</span><span>− {inr(q.coupon.discount)}</span></div> : null}
            <div className="flex justify-between"><span>Booking / service fee</span><span className="font-semibold text-teal">₹0</span></div>
            <div className="flex justify-between"><span>GST</span><span>{inr(q.gst)}</span></div>
            <div className="flex justify-between border-t border-line-soft pt-2.5 text-[19px] font-bold text-ink"><span>Total (INR)</span><span>{inr(q.total)}</span></div>
            <div className="flex justify-between text-sm"><span>Payable now · full amount</span><strong className="text-ink">{inr(q.total)}</strong></div>
            <div className="flex justify-between text-sm"><span>Due at check-in</span><span>₹0</span></div>
          </div>
        ) : null}
        {q?.coupon ? (
          <div className="animate-fade-up rounded-[10px] bg-teal-tint px-3 py-2.5 font-semibold text-teal-dark">You&apos;re saving {inr(q.coupon.discount)} by booking direct</div>
        ) : null}
      </div>

      <div className="card gap-3.5">
        <strong className="text-[17px]">Offers &amp; coupons</strong>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            apply(typed);
          }}
        >
          <input className="field uppercase" aria-label="Coupon code" placeholder="Enter code" value={typed} onChange={(e) => { setTyped(e.target.value); setErr(""); }} />
          <button type="submit" className="shrink-0 rounded-[10px] bg-ink px-4 font-semibold text-white hover:bg-black">Apply</button>
        </form>
        {err ? <span role="alert" className="text-sm text-error-ink">{err}</span> : null}
        {coupons.map((c) => {
          const applied = coupon === c.code && q?.coupon?.code === c.code;
          const eligible = nights >= c.minNights;
          const save = couponDiscount(c.code, roomCost, nights);
          return (
            <div key={c.code} className={`flex items-center justify-between gap-2.5 rounded-xl border-[1.5px] border-dashed px-3.5 py-3 ${applied ? "border-teal bg-teal-wash" : "border-[#a9b8ad] bg-white"} ${eligible ? "" : "opacity-55"}`}>
              <div className="flex min-w-0 flex-col gap-0.5">
                <code className="text-sm font-bold">{c.code}</code>
                <span className="text-sm text-ink-soft">{c.title}</span>
                <span className="text-xs text-muted">{applied ? `Applied · you save ${inr(save)}` : eligible ? `Save ${inr(save)}` : `Needs ${c.minNights}+ nights`}</span>
              </div>
              <button
                type="button"
                onClick={() => (applied ? onCoupon(null) : apply(c.code))}
                className={`min-h-9 shrink-0 px-1 text-sm font-semibold ${applied ? "text-rust" : "text-teal"}`}
              >
                {applied ? "Remove" : "Apply"}
              </button>
            </div>
          );
        })}
      </div>

      <ul className="flex flex-col gap-1.5 px-1.5 text-[13px] text-muted">
        <li>✓ {site.registration}</li>
        <li>✓ Instant confirmation on WhatsApp &amp; email</li>
        <li>✓ Talk to the host: {site.phone}</li>
      </ul>
    </div>
  );
}
