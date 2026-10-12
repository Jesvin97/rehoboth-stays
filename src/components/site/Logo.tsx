import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 no-underline ${light ? "text-white" : "text-ink"}`} aria-label={`${site.name} home`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal font-display text-xl font-bold text-white">
        {site.initial}
      </span>
      <span className="font-display text-[22px] font-bold leading-none">{site.name}</span>
    </Link>
  );
}
