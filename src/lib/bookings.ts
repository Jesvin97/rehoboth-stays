import "server-only";
import { d1, type D1Param } from "./d1";
import type { CheckoutRequest } from "./booking-schema";

/** How long an unpaid booking holds its dates while the guest pays. */
const HOLD_MS = 20 * 60 * 1000;

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
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
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
    g.name.trim(), g.phone, g.email?.trim() || null, g.bookingFor, g.otherName ?? null, g.otherPhone ?? null,
    g.gstin ?? null, g.company ?? null, JSON.stringify(g.requests ?? []), g.message?.slice(0, 1000) || null,
    now, now + HOLD_MS,
    // conflict check
    req.checkOut, req.checkIn, now, req.room, req.room,
  ];
  const r = await d1(
    `INSERT INTO bookings (ref, room, plan, check_in, check_out, adults, children, add_ons, coupon, total, status,
       guest_name, phone, email, booking_for, other_name, other_phone, gstin, company, requests, message,
       razorpay_order_id, created_at, hold_expires_at)
     SELECT ?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?,?,?,?,?,?,NULL,?,?
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
  await d1("UPDATE bookings SET razorpay_order_id = ? WHERE ref = ? AND status = 'pending'", [orderId, ref]);
}

export async function cancelBooking(ref: string) {
  await d1("UPDATE bookings SET status = 'cancelled' WHERE ref = ? AND status = 'pending'", [ref]);
}

export async function getBooking(ref: string): Promise<BookingRow | null> {
  const r = await d1<BookingRow>("SELECT * FROM bookings WHERE ref = ?", [ref]);
  return r.results[0] ?? null;
}

/**
 * Marks a booking paid. Safe to call twice (browser verify + webhook).
 * Returns "paid" on success, "mismatch" if the order doesn't belong to this booking,
 * and "needs_review" if the hold had expired and someone else got the dates first
 * (the guest has paid, so the host must resolve it or refund).
 */
export async function markPaid(ref: string, orderId: string, paymentId: string): Promise<"paid" | "mismatch" | "needs_review"> {
  const b = await getBooking(ref);
  if (!b || b.razorpay_order_id !== orderId) return "mismatch";
  if (b.status === "paid") return "paid";

  const r = await d1(
    `UPDATE bookings SET status = 'paid', razorpay_payment_id = ?, paid_at = ?
     WHERE ref = ? AND razorpay_order_id = ? AND status IN ('pending', 'needs_review')
       AND NOT EXISTS (
         SELECT 1 FROM bookings o
         WHERE o.ref != ? AND o.status = 'paid' AND o.check_in < ? AND o.check_out > ?
           AND (? = 'whole-home' OR o.room = ? OR o.room = 'whole-home')
       )`,
    [paymentId, Date.now(), ref, orderId, ref, b.check_out, b.check_in, b.room, b.room],
  );
  if (r.meta.changes > 0) return "paid";
  await d1("UPDATE bookings SET status = 'needs_review', razorpay_payment_id = ? WHERE ref = ? AND status = 'pending'", [paymentId, ref]);
  return "needs_review";
}

export async function logPaymentEvent(e: { ref: string | null; event: string; orderId: string | null; paymentId: string | null; amountPaise: number | null; raw: string }) {
  await d1(
    `INSERT OR IGNORE INTO payment_events (booking_ref, event, order_id, payment_id, amount_paise, raw, created_at) VALUES (?,?,?,?,?,?,?)`,
    [e.ref, e.event, e.orderId, e.paymentId, e.amountPaise, e.raw.slice(0, 20000), Date.now()],
  );
}
