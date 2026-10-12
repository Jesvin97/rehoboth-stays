"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { Close, Menu } from "../ui/Icons";

const nav = [
  { href: "/#story", label: "The Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#food", label: "Food" },
  { href: "/#offers", label: "Offers" },
  { href: "/#around", label: "Getting Here" },
  { href: "/#faq", label: "FAQs" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="bg-ink text-[13px] text-[#e6ece7]">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5">
          <span>{site.locationLine}</span>
          <div className="flex flex-wrap gap-5">
            <a href={site.phoneHref} className="text-[#e6ece7] no-underline hover:text-white">{site.phone}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-[#e6ece7] no-underline hover:text-white">WhatsApp us</a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line-soft bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-6 py-3.5">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-6 text-[15px] font-medium lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-ink no-underline transition-colors hover:text-teal">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/rooms" className="btn-primary hidden sm:inline-flex">Book your stay</Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
        {open ? (
          <nav aria-label="Mobile" className="animate-pop border-t border-line-soft bg-white lg:hidden">
            <div className="container-x flex flex-col py-2">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-line-soft py-3.5 text-lg font-medium text-ink no-underline last:border-0">
                  {n.label}
                </Link>
              ))}
              <Link href="/rooms" onClick={() => setOpen(false)} className="btn-primary my-3">Book your stay</Link>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
