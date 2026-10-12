import { addDays, nightsBetween } from "./dates";

/**
 * Refunds are counted from the day the booking is made (not the check-in date).
 * Booked on the 6th → 50% until the 8th, 25% on the 9th and 10th, nothing from the 11th.
 */
export const cancellationTiers = [
  { percent: 50, fromDay: 0, toDay: 2 },
  { percent: 25, fromDay: 3, toDay: 4 },
  { percent: 0, fromDay: 5, toDay: Infinity },
] as const;

export function cancellationSchedule(bookedOn: string) {
  return {
    fiftyUntil: addDays(bookedOn, 2),
    quarterFrom: addDays(bookedOn, 3),
    quarterUntil: addDays(bookedOn, 4),
    noRefundFrom: addDays(bookedOn, 5),
  };
}

/** Refund percentage if a booking made on `bookedOn` is cancelled on `cancelledOn`. */
export function refundPercent(bookedOn: string, cancelledOn: string): number {
  const day = nightsBetween(bookedOn, cancelledOn);
  if (day < 0) return 0;
  return cancellationTiers.find((t) => day >= t.fromDay && day <= t.toDay)?.percent ?? 0;
}
