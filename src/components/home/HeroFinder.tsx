"use client";

import Link from "next/link";
import { addDays, formatShort, nightsBetween, todayIST } from "@/lib/dates";
import { site } from "@/lib/site";
import { Picture } from "../stage/Picture";
import { useStage } from "../stage/StageContext";

const nav = [
  { href: "#rooms", label: "Rooms" },
  { href: "#experiences", label: "Experiences" },
  { href: "#letter", label: "Our home" },
  { href: "#getting-here", label: "Getting here" },
];

function Count({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const btn =
    "flex h-11 w-11 items-center justify-center text-[24px] leading-none text-paper transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="flex items-center justify-between gap-3 bg-white/[0.06] pl-4">
      <span className="text-[14px] text-sage">{label}</span>
      <div className="flex items-center">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>−</button>
        <output className="min-w-6 text-center text-[18px] tabular-nums text-paper" aria-live="polite">{value}</output>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>+</button>
      </div>
    </div>
  );
}

/** First screen: the sentence, the stay finder, the name. The fixed photo lives in <Stage>. */
export function HeroFinder() {
  const { stay, setStay, ready } = useStage();
  const today = ready ? todayIST() : undefined;
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const field =
    "min-h-12 w-full bg-white/[0.06] px-4 text-[18px] text-paper outline-none transition-[background-color] duration-200 [color-scheme:dark] focus:bg-white/[0.12]";

  return (
    <section id="top" data-stage="house" className="relative flex min-h-svh flex-col bg-night text-paper">
      {/* Phone: the photograph leads, the name overlaps its bottom edge */}
      <div className="p-3 lg:hidden">
        <Picture k="house" className="h-[58svh] w-full" priority captionTop />
      </div>
      <p aria-hidden="true" className="relative z-10 -mt-[7vw] select-none whitespace-nowrap px-4 font-display text-[11.2vw] font-medium lowercase leading-[0.8] tracking-[-0.035em] text-paper lg:hidden">
        ambattu rehoboth
      </p>

      <nav aria-label="Main" className="order-first flex items-center justify-between gap-4 px-5 py-4 lg:justify-end lg:px-8 lg:py-7 max-lg:absolute max-lg:inset-x-3 max-lg:top-3 max-lg:z-10">
        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="link-quiet text-[18px] text-paper hover:text-paper">{n.label}</a>
            </li>
          ))}
        </ul>
        <span className="bg-ink/60 px-2 py-1 text-[18px] text-paper lg:hidden">{site.name}</span>
        <Link href="/rooms" className="press inline-flex min-h-11 items-center bg-accent px-5 text-[18px] text-white no-underline hover:bg-accent-dark hover:text-white">
          Book a stay
        </Link>
      </nav>

      <div className="flex flex-1 flex-col justify-center px-5 pb-8 lg:pl-[12%] lg:pr-10">
        <p data-reveal style={{ ["--i" as string]: 0 }} className="max-w-[26ch] text-[24px] leading-[1.35] text-paper max-lg:mt-6">
          Four rooms in a family home on a Kerala estate.
        </p>

        <form
          data-reveal
          style={{ ["--i" as string]: 1 }}
          className="mt-10 grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="Find a room for your dates"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <label className="flex flex-col gap-2 text-[14px] text-sage">
            Arriving
            <input
              className={field}
              type="date"
              min={today}
              value={stay.checkIn}
              onChange={(e) => {
                const v = e.target.value;
                setStay({ ...stay, checkIn: v, checkOut: nightsBetween(v, stay.checkOut) < 1 ? addDays(v, 1) : stay.checkOut });
              }}
            />
          </label>
          <label className="flex flex-col gap-2 text-[14px] text-sage">
            Leaving
            <input
              className={field}
              type="date"
              min={stay.checkIn ? addDays(stay.checkIn, 1) : undefined}
              value={stay.checkOut}
              onChange={(e) => setStay({ ...stay, checkOut: e.target.value })}
            />
          </label>
          <Count label="Adults" value={stay.adults} min={1} max={10} onChange={(v) => setStay({ ...stay, adults: v })} />
          <Count label="Children" value={stay.children} min={0} max={6} onChange={(v) => setStay({ ...stay, children: v })} />
          <button type="submit" className="press mt-2 sm:col-span-2 min-h-14 bg-accent text-[18px] text-white transition-[transform,background-color] duration-150 hover:bg-accent-dark">
            {ready && nights >= 1 ? `See rooms for ${formatShort(stay.checkIn)} to ${formatShort(stay.checkOut)}` : "See rooms and prices"}
          </button>
          {ready && nights < 1 ? (
            <p role="alert" className="sm:col-span-2 text-[14px] text-gold-light">Leaving needs to be after arriving.</p>
          ) : null}
        </form>
      </div>

      {/* The name, crossing onto the photograph on desktop */}
      <p
        aria-hidden="true"
        className="wordmark relative z-20 hidden select-none whitespace-nowrap pb-10 font-display text-[7.9vw] font-medium lowercase leading-[0.8] tracking-[-0.035em] text-paper lg:-ml-[10vw] lg:block"
      >
        ambattu rehoboth
      </p>
      <h1 className="sr-only">{site.name}, a homestay in Kerala</h1>
    </section>
  );
}
