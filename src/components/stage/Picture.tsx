import Image from "next/image";
import { photo } from "@/lib/photos";

/**
 * A photograph slot. Renders the real photo when the manifest has one,
 * otherwise a flat tone with a plain caption naming what belongs there.
 * `fill` makes it cover its positioned parent (absolute, inset 0).
 */
export function Picture({
  k,
  className = "",
  sizes = "100vw",
  priority = false,
  fill = false,
  caption = true,
  captionTop = false,
}: {
  k: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  caption?: boolean;
  /** Put the caption at the top (when something overlaps the bottom edge). */
  captionTop?: boolean;
}) {
  const p = photo(k);
  return (
    <div className={`${fill ? "absolute inset-0" : "relative"} overflow-hidden ${className}`} style={{ backgroundColor: p.tone }}>
      {p.src ? (
        <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={`Photograph to come: ${p.alt}`} className={`absolute inset-0 flex p-5 ${captionTop ? "items-start pt-20" : "items-end"}`}>
          {caption ? (
            <span className="max-w-[30ch] bg-ink/55 px-2 py-1 text-[14px] leading-snug text-paper">
              Photograph to come: {p.alt.charAt(0).toLowerCase() + p.alt.slice(1)}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
