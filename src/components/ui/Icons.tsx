type P = { className?: string; size?: number };

function Svg({ size = 20, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ChevronLeft = (p: P) => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>;
export const ChevronRight = (p: P) => <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>;
export const ChevronDown = (p: P) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const Check = (p: P) => <Svg {...p}><path d="M20 6L9 17l-5-5" /></Svg>;
export const Close = (p: P) => <Svg {...p}><path d="M18 6L6 18M6 6l12 12" /></Svg>;
export const Menu = (p: P) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const Lock = (p: P) => <Svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Svg>;
export const Chat = (p: P) => <Svg {...p}><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z" /></Svg>;
export const Heart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
export const MapPin = (p: P) => <Svg {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>;
export const Phone = (p: P) => <Svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></Svg>;
export const Plus = (p: P) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const Minus = (p: P) => <Svg {...p}><path d="M5 12h14" /></Svg>;
