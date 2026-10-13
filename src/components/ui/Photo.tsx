import Image from "next/image";

/**
 * A photograph slot. With `src` it shows the real image (from /public/photos);
 * without one it shows a labelled stand-in in the slot's tone.
 */
export function Photo({
  label,
  src,
  tone = "#c9d3ca",
  className = "",
  dark = false,
  zoom = false,
  align = "end",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  label?: string;
  src?: string;
  tone?: string;
  className?: string;
  dark?: boolean;
  zoom?: boolean;
  align?: "start" | "end";
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: tone }}>
        <Image
          src={src}
          alt={label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${zoom ? "transition-transform duration-700 group-hover:scale-105" : ""}`}
        />
      </div>
    );
  }
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        role="img"
        aria-label={label ? `Photo: ${label}` : "Photo"}
        className={`flex h-full w-full p-4 text-[12px] font-semibold uppercase tracking-[0.06em] ${
          align === "start" ? "items-start" : "items-end"
        } ${dark ? "text-[#dce6de]" : "text-[#2e4238]"} ${zoom ? "transition-transform duration-700 group-hover:scale-105" : ""}`}
        style={{ backgroundColor: tone }}
      >
        {label ? `[${label}]` : null}
      </div>
    </div>
  );
}
