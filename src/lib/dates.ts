const IST = "Asia/Kolkata";
const DAY_MS = 86_400_000;

/** Today's date in India as YYYY-MM-DD, the same on server and browser. */
export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Parse YYYY-MM-DD as a UTC-midnight date so day arithmetic never drifts. */
export function parseISO(iso: string | null | undefined): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  if (!d) return iso;
  return toISO(new Date(d.getTime() + days * DAY_MS));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseISO(checkIn);
  const b = parseISO(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/** "Fri, 13 Nov" */
export function formatShort(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

/** "13 Nov 2026" */
export function formatLong(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function defaultStay() {
  const checkIn = addDays(todayIST(), 14);
  return { checkIn, checkOut: addDays(checkIn, 2) };
}
