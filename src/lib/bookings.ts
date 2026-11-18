import "server-only";
import { d1, type D1Param } from "./d1";
import type { CheckoutRequest } from "./booking-schema";
import { decryptPII, encryptPII } from "./pii";
import { PRIVACY_VERSION } from "./site";

/**
 * How long an unpaid booking holds its dates while the guest pays. The Cashfree order expires
 * earlier (16 minutes), so a payment can never complete after the hold has ended.
 */
const HOLD_MS = 25 * 60 * 1000;

export type BookingRow = {
  ref: string;
  room: string;
  plan: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total: number;
  status: string;
  guest_name: string;
  phone: string;
  created_at: number;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  cancelled_at: number | null;
  cancel_reason: string | null;
  refund_percent: number | null;
  refund_amount: number | null;
  refund_id: string | null;
  refund_status: string | null;
};

/**
 * Saves a pending booking only if the dates are free. The check and the insert
 * are ONE statement, so two guests can't both take the same dates.
 * The whole home clashes with every room, and every room clashes with the whole home.
 * Returns false when the dates are taken.
 */
export async function createPendingBooking(ref: string, req: CheckoutRequest, total: number): Promise<boolean> {
  const now = Date.now();
  const g = req.guest;
  const params: D1Param[] = [
    ref, req.room, req.plan, req.checkIn, req.checkOut, req.adults, req.children,
    JSON.stringify(req.addOns), req.coupon, total,
    // Personal data is encrypted before it leaves the server.
    encryptPII(g.name.trim(), "bookings.guest_name"), encryptPII(g.phone, "bookings.phone"),
    encryptPII(g.email?.trim(), "bookings.email"), g.bookingFor,
    encryptPII(g.otherName, "bookings.other_name"), encryptPII(g.otherPhone, "bookings.other_phone"),
    encryptPII(g.gstin, "bookings.gstin"), encryptPII(g.company, "bookings.company"),
    JSON.stringify(g.requests ?? []), encryptPII(g.message?.slice(0, 1000), "bookings.message"),
    now, now + HOLD_MS, now, PRIVACY_VERSION,
    // conflict check
    req.checkOut, req.checkIn, now, req.room, req.room,
  ];
  const r = await d1(
    `INSERT INTO bookings (ref, room, plan, check_in, check_out, adults, children, add_ons, coupon, total, status,
       guest_name, phone, email, booking_for, other_name, other_phone, gstin, company, requests, message,
       provider_order_id, created_at, hold_expires_at, consent_at, consent_version)
     SELECT ?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?,?,?,?,?,?,NULL,?,?,?,?
     WHERE NOT EXISTS (
       SELECT 1 FROM bookings b
       WHERE b.check_in < ? AND b.check_out > ?
         AND (b.status = 'paid' OR (b.status = 'pending' AND b.hold_expires_at > ?))
         AND (? = 'whole-home' OR b.room = ? OR b.room = 'whole-home')
     )`,
    params,
  );
  return r.meta.changes > 0;
}

export async function attachOrder(ref: string, orderId: string) {
  await d1("UPDATE bookings SET provider_order_id = ? WHERE ref = ? AND status = 'pending'", [orderId, ref]);
}

export async function cancelBooking(ref: string) {
  await d1("UPDATE bookings SET status = 'cancelled' WHERE ref = ? AND status = 'pending'", [ref]);
}

export async function getBooking(ref: string): Promise<BookingRow | null> {
  const r = await d1<BookingRow>("SELECT * FROM bookings WHERE ref = ?", [ref]);
  const row = r.results[0];
  if (!row) return null;
  // Name and phone are encrypted at rest; decrypt only what the caller needs.
  return { ...row, guest_name: decryptPII(row.guest_name, "bookings.guest_name") ?? "", phone: decryptPII(row.phone, "bookings.phone") ?? "" };
}

/**
 * Marks a booking paid. Safe to call twice (browser verify + webhook).
 * Returns "paid" on success, "mismatch" if the order doesn't belong to this booking,
 * and "needs_review" if the hold had expired and someone else got the dates first
 * (the guest has paid, so the host must resolve it or refund).
 */
export async function markPaid(ref: string, orderId: string, paymentId: string): Promise<"paid" | "mismatch" | "needs_review"> {
  const b = await getBooking(ref);
  if (!b || b.provider_order_id !== orderId) return "mismatch";
  if (b.status === "paid") return "paid";

  const r = await d1(
    `UPDATE bookings SET status = 'paid', provider_payment_id = ?, paid_at = ?
     WHERE ref = ? AND provider_order_id = ? AND status IN ('pending', 'needs_review')
       AND NOT EXISTS (
         SELECT 1 FROM bookings o
         WHERE o.ref != ? AND o.status = 'paid' AND o.check_in < ? AND o.check_out > ?
           AND (? = 'whole-home' OR o.room = ? OR o.room = 'whole-home')
       )`,
    [paymentId, Date.now(), ref, orderId, ref, b.check_out, b.check_in, b.room, b.room],
  );
  if (r.meta.changes > 0) return "paid";
  await d1("UPDATE bookings SET status = 'needs_review', provider_payment_id = ? WHERE ref = ? AND status = 'pending'", [paymentId, ref]);
  return "needs_review";
}

export async function logPaymentEvent(e: { ref: string | null; event: string; orderId: string | null; paymentId: string | null; amountPaise: number | null; raw: string }) {
  await d1(
    `INSERT OR IGNORE INTO payment_events (booking_ref, event, order_id, payment_id, amount_paise, raw, created_at) VALUES (?,?,?,?,?,?,?)`,
    [e.ref, e.event, e.orderId, e.paymentId, e.amountPaise, e.raw.slice(0, 20000), Date.now()],
  );
}

/**
 * Cancels a booking and records the refund, in ONE atomic step, so a booking can only ever be
 * cancelled (and refunded) once, even if two requests arrive together. Cancelled bookings free their dates.
 * `from` is the status the booking must currently have: "paid" for a guest cancellation,
 * "needs_review" when the dates were lost while the guest was paying.
 * Returns false if the booking was no longer in that status.
 */
export async function claimCancellation(
  ref: string,
  p: { from: "paid" | "needs_review"; reason: "guest" | "dates_unavailable"; percent: number; amount: number; refundId: string },
): Promise<boolean> {
  const r = await d1(
    `UPDATE bookings SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, refund_percent = ?, refund_amount = ?, refund_id = ?, refund_status = ?
     WHERE ref = ? AND status = ?`,
    [Date.now(), p.reason, p.percent, p.amount, p.refundId, p.amount > 0 ? "pending" : "none", ref, p.from],
  );
  return r.meta.changes > 0;
}

export async function setRefundStatus(ref: string, status: "pending" | "processing" | "processed" | "failed") {
  await d1("UPDATE bookings SET refund_status = ? WHERE ref = ? AND status = 'cancelled'", [status, ref]);
}
