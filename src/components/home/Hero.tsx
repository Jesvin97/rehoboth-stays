"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/content";
import { site } from "@/lib/site";
import { addDays, defaultStay, nightsBetween, todayIST } from "@/lib/dates";
import { ChevronDown, ChevronLeft, ChevronRight } from "../ui/Icons";
import { Stepper } from "../ui/Stepper";

/** Full-screen photo hero (Taj) with a refined "Book a stay" bar (Voye fields). */
export function Hero() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  // Filled in after load: the homepage is pre-built, so dates must come from the visitor's "today".
  const [{ checkIn, checkOut }, setDates] = useState({ checkIn: "", checkOut: "" });
  useEffect(() => setDates(defaultStay()), []);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [error, setError] = useState("");
  const guestsRef = useRef<HTMLDivElement>(null);
  const today = checkIn ? todayIST() : undefined;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (!guestsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setGuestsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGuestsOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [guestsOpen]);

  const go = (i: number) => {
    setPaused(true);
    setSlide((i + heroSlides.length) % heroSlides.length);
  };

  const guestLabel = `${adults} ${adults === 1 ? "Adult" : "Adults"}${children ? `, ${children} ${children === 1 ? "Child" : "Children"}` : ""}`;

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (nightsBetween(checkIn, checkOut) < 1) {
      setError("Check-out needs to be after check-in.");
      return;
    }
    setError("");
    const q = new URLSearchParams({ in: checkIn, out: checkOut, adults: String(adults), children: String(children) });
    router.push(`/rooms?${q.toString()}`);
  }

  return (
    <section className="relative" aria-roledescription="carousel" aria-label="Photos of the homestay">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-forest text-center">
        {heroSlides.map((s, i) =>
          s.src ? (
            <div
              key={s.label}
              aria-hidden={i !== slide}
              className="absolute inset-0 transition-opacity duration-[1400ms]"
              style={{ backgroundColor: s.tone, opacity: i === slide ? 1 : 0 }}
            >
              <Image src={s.src} alt={s.label} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          ) : (
            <div
              key={s.label}
              role="img"
              aria-label={`Photo: ${s.label}`}
              aria-hidden={i !== slide}
              className="absolute inset-0 flex items-start justify-end px-8 pt-36 max-sm:hidden text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 transition-opacity duration-[1400ms]"
              style={{ backgroundColor: s.tone, opacity: i === slide ? 1 : 0 }}
            >
              [{s.label}]
            </div>
          ),
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,20,0.55)_0%,rgba(15,24,20,0.15)_40%,rgba(15,24,20,0.6)_100%)]" aria-hidden="true" />

        <div className="relative flex max-w-[860px] flex-col items-center gap-6 px-4 pb-40 pt-36">
          <p className="text-[12px] font-medium uppercase tracking-[0.4em] text-gold-light">A family home in {site.region}</p>
          <h1 className="font-display text-[clamp(44px,7vw,92px)] font-medium leading-[1.02] text-white">
            Where the estate wakes up with you
          </h1>
          <div className="ornament text-gold-light before:bg-gold-light after:bg-gold-light" aria-hidden="true">✦</div>
          <p className="max-w-[560px] text-lg font-light text-white/90">[One line on what makes the home special — e.g. a 90-year-old tharavad on a spice estate, hosted by the [Family] family.]</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/#story" className="btn-light">Discover the home</Link>
          </div>
        </div>

        <div className="absolute bottom-40 right-4 flex items-center gap-2 sm:right-8 max-sm:hidden">
          <span key={slide} className="animate-fade-up mr-3 text-[13px] font-light tracking-[0.06em] text-white/90" aria-live="polite">{heroSlides[slide].caption}</span>
          <button type="button" onClick={() => go(slide - 1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center border border-white/50 text-white hover:bg-white/15">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => go(slide + 1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center border border-white/50 text-white hover:bg-white/15">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute bottom-[136px] left-1/2 flex -translate-x-1/2 gap-2 sm:hidden">
          {heroSlides.map((s, i) => (
            <button key={s.label} type="button" onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === slide} className={`h-[3px] transition-all ${i === slide ? "w-8 bg-white" : "w-4 bg-white/45"}`} />
          ))}
        </div>
      </div>

      {/* Booking bar, overlapping the bottom of the hero */}
      <div className="container-x relative z-10 -mt-[104px]">
        <form onSubmit={onSearch} aria-label="Book a stay" className="bg-white shadow-[0_24px_60px_rgba(28,43,36,0.16)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="field-label border-b border-line-soft px-6 pb-4 pt-5 sm:border-r lg:border-b-0">
              Check-in
              <input
                className="min-h-9 bg-transparent font-display text-[22px] font-medium normal-case tracking-normal text-ink outline-none"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  const v = e.target.value;
                  setDates((d) => ({ checkIn: v, checkOut: nightsBetween(v, d.checkOut) < 1 ? addDays(v, 1) : d.checkOut }));
                }}
              />
            </label>
            <label className="field-label border-b border-line-soft px-6 pb-4 pt-5 lg:border-b-0 lg:border-r">
              Check-out
              <input
                className="min-h-9 bg-transparent font-display text-[22px] font-medium normal-case tracking-normal text-ink outline-none"
                type="date"
                min={checkIn ? addDays(checkIn, 1) : undefined}
                value={checkOut}
                onChange={(e) => setDates((d) => ({ ...d, checkOut: e.target.value }))}
              />
            </label>
            <div className="relative flex flex-col gap-1.5 border-b border-line-soft px-6 pb-4 pt-5 sm:border-r lg:border-b-0" ref={guestsRef}>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted" id="guests-label">Guests</span>
              <button
                type="button"
                aria-labelledby="guests-label"
                aria-expanded={guestsOpen}
                onClick={() => setGuestsOpen((o) => !o)}
                className="flex min-h-9 items-center justify-between gap-3 text-left font-display text-[22px] font-medium text-ink"
              >
                {guestLabel}
                <ChevronDown size={16} />
              </button>
              {guestsOpen ? (
                <div className="animate-pop absolute left-0 top-full z-20 mt-1 flex w-[320px] max-w-[calc(100vw-48px)] flex-col gap-4 border border-line bg-white p-5 shadow-[0_18px_40px_rgba(28,43,36,0.16)]">
                  <Stepper label="Adults" hint="13 years and above" value={adults} min={1} max={10} onChange={setAdults} />
                  <Stepper label="Children" hint="3–12 years · under 3 stay free" value={children} min={0} max={6} onChange={setChildren} />
                  <button type="button" onClick={() => setGuestsOpen(false)} className="btn-primary">Done</button>
                </div>
              ) : null}
            </div>
            <button type="submit" className="btn-primary min-h-[88px] px-10 text-[13px] max-lg:min-h-14">
              Check availability
            </button>
          </div>
          {error ? <p className="animate-fade-up border-t border-line-soft bg-error-bg px-6 py-3 text-error-ink" role="alert">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
