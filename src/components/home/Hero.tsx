"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/content";
import { site } from "@/lib/site";
import { addDays, defaultStay, nightsBetween, todayIST } from "@/lib/dates";
import { ChevronDown, ChevronLeft, ChevronRight } from "../ui/Icons";
import { Stepper } from "../ui/Stepper";

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
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
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

  const guestLabel = `${adults} ${adults === 1 ? "adult" : "adults"}${children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}`;

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
    <section className="relative flex min-h-[720px] flex-col justify-end bg-[#2c3f35]" aria-roledescription="carousel" aria-label="Photos of the homestay">
      {heroSlides.map((s, i) => (
        <div
          key={s.label}
          role="img"
          aria-label={`Photo: ${s.label}`}
          aria-hidden={i !== slide}
          className="absolute inset-0 p-6 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#dce6de] transition-opacity duration-1000"
          style={{ backgroundColor: s.tone, opacity: i === slide ? 1 : 0 }}
        >
          [{s.label}]
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% to-[rgba(20,30,25,0.75)]" aria-hidden="true" />

      <div className="container-x relative flex flex-col gap-6 pb-10 pt-32">
        <div className="flex max-w-[720px] flex-col gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-light">A family home in {site.region}</p>
          <h1 className="font-display text-[clamp(40px,6vw,78px)] font-bold leading-none text-white">Live like a local. Wake up somewhere green.</h1>
          <p className="max-w-[560px] text-lg text-[#e6ece7]">[One line on what makes the home special — e.g. a 90-year-old tharavad on a spice estate, hosted by the [Family] family.]</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span key={slide} className="animate-fade-up font-medium text-white" aria-live="polite">{heroSlides[slide].caption}</span>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === slide}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === slide ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(slide - 1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-white/70 text-white hover:bg-white/15">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => go(slide + 1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-white/70 text-white hover:bg-white/15">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={onSearch} aria-label="Check availability" className="flex flex-col gap-3.5 rounded-[18px] bg-white p-[18px] shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
          <div className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="field-label">
              Check-in
              <input
                className="field"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  const v = e.target.value;
                  setDates((d) => ({ checkIn: v, checkOut: nightsBetween(v, d.checkOut) < 1 ? addDays(v, 1) : d.checkOut }));
                }}
              />
            </label>
            <label className="field-label">
              Check-out
              <input className="field" type="date" min={checkIn ? addDays(checkIn, 1) : undefined} value={checkOut} onChange={(e) => setDates((d) => ({ ...d, checkOut: e.target.value }))} />
            </label>
            <div className="relative flex flex-col gap-1.5" ref={guestsRef}>
              <span className="text-[13px] font-semibold text-[#4a5c52]" id="guests-label">Guests</span>
              <button
                type="button"
                aria-labelledby="guests-label"
                aria-expanded={guestsOpen}
                onClick={() => setGuestsOpen((o) => !o)}
                className="field flex items-center justify-between text-left font-medium"
              >
                {guestLabel}
                <ChevronDown size={16} />
              </button>
              {guestsOpen ? (
                <div className="animate-pop absolute left-0 top-full z-20 mt-2 flex w-[300px] max-w-[calc(100vw-64px)] flex-col gap-3.5 rounded-[14px] border border-line bg-white p-4 shadow-[0_14px_34px_rgba(28,43,36,0.18)]">
                  <Stepper label="Adults" hint="13 years and above" value={adults} min={1} max={10} onChange={setAdults} />
                  <Stepper label="Children" hint="Under 12" value={children} min={0} max={6} onChange={setChildren} />
                  <button type="button" onClick={() => setGuestsOpen(false)} className="btn-primary rounded-[10px]">Done</button>
                </div>
              ) : null}
            </div>
            <button type="submit" className="btn-primary min-h-[46px] rounded-[10px] px-6">Check availability</button>
          </div>
          {error ? <p className="animate-fade-up rounded-xl bg-error-bg px-4 py-3 text-error-ink" role="alert">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
