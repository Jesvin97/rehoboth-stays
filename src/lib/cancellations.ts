import "server-only";
import { createRefund, getRefund } from "./cashfree-server";
import { claimCancellation, getBooking, setRefundStatus, type BookingRow } from "./bookings";
import { canCancelOnline, daysBeforeCheckIn, refundAmount, refundPercent } from "./cancellation";
import { todayIST } from "./dates";
import crypto from "node:crypto";

const REF = /^RS-[0-9A-Z]{6}$/;

function mapRefundStatus(s: string | undefined): "processed" | "processing" | "failed" {
  if (s === "SUCCESS") return "processed";
  if (s === "CANCELLED") return "failed";
  return "processing"; // PENDING, ONHOLD or anything new: still on its way
}

function samePhone(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Looks a booking up by reference AND the mobile number it was made with. Returns null if either is wrong. */
export async function findBookingForGuest(ref: string, phone: string): Promise<BookingRow | null> {
  if (!REF.test(ref) || !/^[6-9]\d{9}$/.test(phone)) return null;
  const b = await getBooking(ref).catch(() => null);
  if (!b || !samePhone(b.phone, phone)) return null;
  return b;
}

export type CancelPreview = {
  status: "paid" | "cancelled" | "other";
  room: string;
  checkIn: string;
  checkOut: string;
  total: number;
  daysBefore: number;
  canCancel: boolean;
  percent: number;
  refund: number;
  /** For an already-cancelled booking. */
  refundStatus?: string | null;
};

/** What the guest would get back if they cancelled today. Everything is worked out on the server. */
export function previewCancellation(b: BookingRow): CancelPreview {
  const today = todayIST();
  const daysBefore = daysBeforeCheckIn(b.check_in, today);
  const percent = refundPercent(b.check_in, today);
  if (b.status === "cancelled") {
    return { status: "cancelled", room: b.room, checkIn: b.check_in, checkOut: b.check_out, total: b.total, daysBefore, canCancel: false, percent: b.refund_percent ?? 0, refund: b.refund_amount ?? 0, refundStatus: b.refund_status };
  }
  const paid = b.status === "paid";
  return {
    status: paid ? "paid" : "other",
    room: b.room,
    checkIn: b.check_in,
    checkOut: b.check_out,
    total: b.total,
    daysBefore,
    canCancel: paid && canCancelOnline(b.check_in, today),
    percent,
    refund: refundAmount(b.total, percent),
  };
}

/**
 * Sends the refund to Cashfree for a cancelled booking. Safe to call again: the refund id is fixed,
 * so Cashfree never refunds twice. Leaves the status at "failed" if Cashfree could not be reached,
 * so it can be retried.
 */
export async function processRefund(ref: string): Promise<"processed" | "processing" | "failed" | "none"> {
  const b = await getBooking(ref);
  if (!b || b.status !== "cancelled" || !b.refund_id || !b.refund_amount) return "none";
  if (b.refund_status === "processed") return "processed";

  try {
    // If a refund with this id already exists at Cashfree, just read its status.
    let r = await getRefund(ref, b.refund_id).catch(() => null);
    if (!r || !r.refund_status) {
      r = await createRefund({ orderId: ref, refundId: b.refund_id, amountRupees: b.refund_amount, note: `Cancellation ${ref}` });
    }
    const status = mapRefundStatus(r.refund_status);
    await setRefundStatus(ref, status);
    return status;
  } catch (err) {
    console.error("Refund failed for", ref, err);
    await setRefundStatus(ref, "failed").catch(() => {});
    return "failed";
  }
}

export type CancelOutcome =
  | { ok: true; refund: number; percent: number; refundStatus: "processed" | "processing" | "failed" | "none"; alreadyCancelled?: boolean }
  | { ok: false; reason: "not_found" | "not_paid" | "started" };

/**
 * Cancels a guest's booking and refunds the amount the policy allows for TODAY.
 * The percentage is always worked out here, from the dates, never taken from the browser.
 */
export async function cancelAndRefund(ref: string, phone: string): Promise<CancelOutcome> {
  const b = await findBookingForGuest(ref, phone);
  if (!b) return { ok: false, reason: "not_found" };

  if (b.status === "cancelled") {
    // Already cancelled: make sure the refund went out (this also retries a failed one).
    const refundStatus = b.refund_amount ? await processRefund(ref) : "none";
    return { ok: true, refund: b.refund_amount ?? 0, percent: b.refund_percent ?? 0, refundStatus, alreadyCancelled: true };
  }
  if (b.status !== "paid") return { ok: false, reason: "not_paid" };

  const today = todayIST();
  if (!canCancelOnline(b.check_in, today)) return { ok: false, reason: "started" };

  const percent = refundPercent(b.check_in, today);
  const amount = refundAmount(b.total, percent);
  const claimed = await claimCancellation(ref, { from: "paid", reason: "guest", percent, amount, refundId: `${ref}-R1` });
  if (!claimed) return { ok: false, reason: "not_paid" }; // changed while we were working

  const refundStatus = amount > 0 ? await processRefund(ref) : "none";
  return { ok: true, refund: amount, percent, refundStatus };
}

/**
 * The guest paid but someone else had already taken the dates (their hold had lapsed).
 * They get a FULL refund automatically and the booking is cancelled, so no double booking is ever kept.
 */
export async function refundDatesLost(ref: string): Promise<"refunded" | "failed"> {
  const b = await getBooking(ref);
  if (!b) return "failed";
  if (b.status === "needs_review") {
    await claimCancellation(ref, { from: "needs_review", reason: "dates_unavailable", percent: 100, amount: b.total, refundId: `${ref}-R1` });
  }
  const after = await getBooking(ref);
  if (after?.status !== "cancelled") return "failed";
  const status = await processRefund(ref);
  return status === "failed" ? "failed" : "refunded";
}
