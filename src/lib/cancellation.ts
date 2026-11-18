import { addDays, nightsBetween } from "./dates";

/**
 * Refund policy, counted in days BEFORE the check-in date (India time).
 * Example for a stay starting on the 31st: cancel on or before the 15th and 25% is kept (75% refunded);
 * from the 16th to the 28th 50% is kept; from the 29th to the 31st everything is kept.
 * This list is the single source of truth: the checkout, the confirmation page,
 * the policies page and the cancellation itself all read it. To change the policy, edit it here.
 * Keep it ordered from the most days to the fewest, and end with minDaysBefore: 0.
 */
export const refundTiers = [
  { minDaysBefore: 16, percent: 75 }, // 25% of the amount is kept
  { minDaysBefore: 3, percent: 50 }, // 50% is kept
  { minDaysBefore: 0, percent: 0 }, // the last 3 days, check-in day included: everything is kept
] as const;

/** The share of the amount the homestay keeps as a cancellation charge. */
export const keptPercent = (refund: number) => 100 - refund;

/** "75% refund" or "no refund". */
export const refundLabel = (percent: number) => (percent > 0 ? `${percent}% refund` : "no refund");

/** The whole policy as one sentence, for the FAQ. */
export function describeTiers(): string {
  return refundTiers
    .map((t, i, all) => {
      const prev = i > 0 ? all[i - 1].minDaysBefore : null;
      const days = prev === null ? `${t.minDaysBefore} or more days before check-in` : `${t.minDaysBefore} to ${prev - 1} days before check-in`;
      return `${days}: ${t.percent > 0 ? `${t.percent}% refund, ${keptPercent(t.percent)}% kept` : "no refund"}`;
    })
    .join("; ");
}

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
