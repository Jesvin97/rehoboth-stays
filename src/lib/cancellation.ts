import { addDays, nightsBetween } from "./dates";

/**
 * Refund policy, counted in days BEFORE the check-in date (India time).
 * This list is the single source of truth: the checkout, the confirmation page,
 * the policies page and the cancellation itself all read it. To change the policy, edit it here.
 * Keep it ordered from the most days to the fewest, and end with minDaysBefore: 0.
 */
export const refundTiers = [
  { minDaysBefore: 15, percent: 100 },
  { minDaysBefore: 7, percent: 75 },
  { minDaysBefore: 3, percent: 50 },
  { minDaysBefore: 0, percent: 25 },
] as const;

/** Whole days from `today` to check-in. 0 on the check-in day, negative once the stay has started. */
export function daysBeforeCheckIn(checkIn: string, today: string): number {
  return nightsBetween(today, checkIn);
}

/** Guests can cancel online until the check-in day. After that, they should contact the host. */
export function canCancelOnline(checkIn: string, today: string): boolean {
  return daysBeforeCheckIn(checkIn, today) >= 0;
}

/** Refund percentage if a booking for `checkIn` is cancelled on `cancelledOn`. */
export function refundPercent(checkIn: string, cancelledOn: string): number {
  const d = daysBeforeCheckIn(checkIn, cancelledOn);
  if (d < 0) return 0;
  return refundTiers.find((t) => d >= t.minDaysBefore)?.percent ?? 0;
}

/** The refund in whole rupees (rounded down) for the amount the guest paid, GST included. */
export function refundAmount(total: number, percent: number): number {
  return Math.floor((total * percent) / 100);
}

export type RefundRow = {
  percent: number;
  /** First day this refund applies (null = any earlier day). */
  from: string | null;
  /** Last day this refund applies. */
  until: string;
};

/** The refund timeline for a stay starting on `checkIn`, as of `today`. Past tiers are left out. */
export function refundSchedule(checkIn: string, today: string): RefundRow[] {
  const rows: RefundRow[] = [];
  let prevUntil: string | null = null;
  for (const t of refundTiers) {
    const until = addDays(checkIn, -t.minDaysBefore);
    const from = prevUntil ? addDays(prevUntil, 1) : null;
    prevUntil = until;
    if (until < today) continue; // that window has already passed
    rows.push({ percent: t.percent, from: from && from < today ? today : from, until });
  }
  return rows;
}
