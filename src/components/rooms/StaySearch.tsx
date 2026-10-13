"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, formatShort, nightsBetween, todayIST } from "@/lib/dates";
import { stayQuery, type Stay } from "@/lib/booking-params";
import { Stepper } from "../ui/Stepper";

/** Date and guest search shown above the room list. */
export function StaySearch({ initial }: { initial: Stay }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [editingGuests, setEditingGuests] = useState(false);
  const n = nightsBetween(s.checkIn, s.checkOut);
  const today = todayIST();

  const apply = (next: Stay) => {
    setS(next);
    if (nightsBetween(next.checkIn, next.checkOut) >= 1) router.replace(`/rooms?${stayQuery(next)}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 rounded-[3px] bg-white p-[18px] shadow-[0_8px_28px_rgba(28,43,36,0.08)]">
      <div className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-3">
        <label className="field-label">
          Check-in
          <input
            className="field"
            type="date"
            min={today}
            value={s.checkIn}
            onChange={(e) => {
              const v = e.target.value;
              apply({ ...s, checkIn: v, checkOut: nightsBetween(v, s.checkOut) < 1 ? addDays(v, 1) : s.checkOut });
            }}
          />
        </label>
        <label className="field-label">
          Check-out
          <input className="field" type="date" min={addDays(s.checkIn, 1)} value={s.checkOut} onChange={(e) => apply({ ...s, checkOut: e.target.value })} />
        </label>
        <button type="button" onClick={() => setEditingGuests((v) => !v)} aria-expanded={editingGuests} className="field text-left font-medium">
          {s.adults} {s.adults === 1 ? "adult" : "adults"}
          {s.children ? `, ${s.children} ${s.children === 1 ? "child" : "children"}` : ""}
        </button>
      </div>
      {editingGuests ? (
        <div className="animate-fade-up grid grid-cols-1 gap-4 rounded-xl bg-paper p-4 sm:grid-cols-2">
          <Stepper label="Adults" hint="13+ years" value={s.adults} min={1} max={10} onChange={(v) => apply({ ...s, adults: v })} />
          <Stepper label="Children" hint="Under 12" value={s.children} min={0} max={6} onChange={(v) => apply({ ...s, children: v })} />
        </div>
      ) : null}
      <p className="rounded-xl bg-accent-tint px-4 py-3 text-[15px]" aria-live="polite">
        {n >= 1 ? (
          <>
            <strong>{formatShort(s.checkIn)} – {formatShort(s.checkOut)}</strong> · {n} {n === 1 ? "night" : "nights"}. Prices below are per night; pick a room to see your total.
          </>
        ) : (
          "Check-out needs to be after check-in."
        )}
      </p>
    </div>
  );
}
