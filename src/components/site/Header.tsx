"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { Close, Menu } from "../ui/Icons";

const nav = [
  { href: "/#story", label: "The Home" },
  { href: "/rooms", label: "Stay" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#dining", label: "Dining" },
  { href: "/#wellness", label: "Wellness" },
  { href: "/#offers", label: "Offers" },
  { href: "/#around", label: "Getting Here" },
];

/**
 * `overlay` = transparent over a full-screen hero, turning solid on scroll.
 */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const clear = overlay && !scrolled && !open;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-300 ${
        clear ? "bg-transparent text-white" : "bg-white text-ink shadow-[0_1px_0_var(--color-line)]"
      }`}
    >
      <div className={`border-b text-[12px] tracking-[0.08em] transition-colors ${clear ? "border-white/15" : "border-line-soft bg-paper"}`}>
        <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <span className={clear ? "text-white/85" : "text-muted"}>{site.locationLine}</span>
          <div className="flex flex-wrap gap-5">
            <a href={site.phoneHref} className={`no-underline ${clear ? "text-white/85 hover:text-white" : "text-muted hover:text-accent"}`}>{site.phone}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`no-underline ${clear ? "text-white/85 hover:text-white" : "text-muted hover:text-accent"}`}>WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="container-x flex items-center justify-between gap-6 py-4">
        <Logo light={clear} />
        <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative text-[12px] font-medium uppercase tracking-[0.2em] no-underline after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full ${
                clear ? "text-white hover:text-white" : "text-ink hover:text-accent"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/rooms" className={clear ? "btn-light hidden sm:inline-flex" : "btn-primary hidden sm:inline-flex"}>
            Book a stay
          </Link>
          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center border xl:hidden ${clear ? "border-white/60" : "border-line"}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="animate-pop max-h-[calc(100svh-120px)] overflow-y-auto border-t border-line-soft bg-white text-ink xl:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-line-soft py-4 font-display text-2xl text-ink no-underline last:border-0 hover:text-accent">
                {n.label}
              </Link>
            ))}
            <Link href="/rooms" onClick={() => setOpen(false)} className="btn-primary my-4">Book a stay</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
