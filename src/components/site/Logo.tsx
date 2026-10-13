import Link from "next/link";
import { site } from "@/lib/site";

/** Serif wordmark with a gold monogram. `light` for use over photos / dark bands. */
export function Logo({ light = false }: { light?: boolean }) {
  const small = `text-[9px] font-medium uppercase tracking-[0.48em] ${light ? "text-gold-light" : "text-accent"}`;
  return (
    <Link href="/" className={`group flex items-center gap-3 no-underline ${light ? "text-white hover:text-white" : "text-ink hover:text-ink"}`} aria-label={`${site.name} home`}>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-[22px] font-semibold transition-colors ${
          light ? "border-gold-light text-gold-light" : "border-gold text-accent"
        }`}
        aria-hidden="true"
      >
        {site.initial}
      </span>
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className={small}>Ambattu</span>
        <span className="my-[3px] font-display text-[22px] font-semibold uppercase tracking-[0.2em]">Rehoboth</span>
        <span className={small}>Stays</span>
      </span>
    </Link>
  );
}
