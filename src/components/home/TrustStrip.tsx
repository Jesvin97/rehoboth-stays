/** Voye-style trust strip: icon + big number + label. Values are placeholders. */
const items = [
  {
    value: "[N] rooms",
    label: "Private & family-run",
    icon: <path d="M3 21V9l9-6 9 6v12M9 21v-6h6v6" />,
  },
  {
    value: "[N] acres",
    label: "Of [coffee / spice] estate",
    icon: <path d="M12 21c-4-3-7-7-7-11a7 7 0 0 1 14 0c0 4-3 8-7 11zM12 21V10" />,
  },
  {
    value: "Since [Year]",
    label: "Hosting guests",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
  {
    value: "[4.9] / 5",
    label: "[N] guest reviews",
    icon: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  },
];

export function TrustStrip() {
  return (
    <ul className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-line">
      {items.map((it) => (
        <li key={it.label} className="flex flex-col items-center gap-3 px-4 text-center">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-gold" aria-hidden="true">
            {it.icon}
          </svg>
          <span className="font-display text-[clamp(28px,3vw,40px)] font-medium leading-none">{it.value}</span>
          <span className="text-[12px] uppercase tracking-[0.2em] text-muted">{it.label}</span>
        </li>
      ))}
    </ul>
  );
}
