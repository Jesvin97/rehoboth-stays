/**
 * Labelled stand-in for a real photograph. Replace each usage with
 * next/image once the client's photos are in /public/photos.
 */
export function Photo({
  label,
  tone = "#c9d3ca",
  className = "",
  dark = false,
  zoom = false,
  align = "end",
}: {
  label?: string;
  tone?: string;
  className?: string;
  dark?: boolean;
  zoom?: boolean;
  align?: "start" | "end";
}) {
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
