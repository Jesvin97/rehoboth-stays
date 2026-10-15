import { galleryKeys } from "@/lib/photos";
import { Picture } from "../stage/Picture";

/** A sideways-scrolling row of photographs in three module shapes: tall, stacked pair, wide. */
export function GalleryRow() {
  const k = galleryKeys;
  // tall, pair, wide, pair, tall, wide  (nine photographs)
  const modules: ({ type: "tall" | "wide"; keys: [string] } | { type: "pair"; keys: [string, string] })[] = [
    { type: "tall", keys: [k[0]] },
    { type: "pair", keys: [k[1], k[2]] },
    { type: "wide", keys: [k[3]] },
    { type: "pair", keys: [k[4], k[5]] },
    { type: "tall", keys: [k[6]] },
    { type: "wide", keys: [k[7]] },
  ];
  return (
    <section aria-labelledby="gallery-h" className="bg-paper py-36">
      <div className="flex items-baseline justify-between gap-6 px-5 lg:px-[6vw]">
        <h2 id="gallery-h" data-reveal className="font-display text-[clamp(2rem,1.3rem+2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Around the house
        </h2>
        <p className="text-[14px] text-muted">{k.length - 1} photographs, drag sideways</p>
      </div>
      <div
        className="drag-row mt-8 flex h-[62svh] gap-2 overflow-x-auto px-5 [scroll-snap-type:x_proximity] [scrollbar-width:none] sm:h-[68svh] sm:gap-3 lg:px-[6vw] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-label="Photographs of the house, scroll sideways"
      >
        {modules.map((m, i) =>
          m.type === "pair" ? (
            <div key={i} data-reveal style={{ ["--i" as string]: i }} className="flex h-full w-[64vw] shrink-0 snap-start flex-col gap-2 sm:w-[min(36vw,520px)] sm:gap-3">
              <Picture k={m.keys[0]} className="min-h-0 flex-1" sizes="36vw" />
              <Picture k={m.keys[1]} className="min-h-0 flex-1" sizes="36vw" />
            </div>
          ) : (
            <div
              key={i}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`h-full shrink-0 snap-start ${m.type === "tall" ? "w-[72vw] sm:w-auto sm:aspect-[3/4]" : "w-[88vw] sm:w-auto sm:aspect-[16/10]"}`}
            >
              <Picture k={m.keys[0]} className="h-full w-full" sizes="60vw" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
