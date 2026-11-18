import "server-only";
import { getOrder, getPaidPaymentId } from "./cashfree-server";
import { getBooking, logPaymentEvent, markPaid } from "./bookings";

export type PaymentResult = "paid" | "pending" | "failed" | "not_found" | "needs_review";

/**
 * Asks Cashfree whether this booking's order is paid, and if so confirms the booking.
 * This is the ONLY way a booking becomes paid: the browser, the return page and the
 * webhook all call it, so nothing the browser says is ever trusted. Safe to call repeatedly.
 */
export async function confirmPayment(ref: string): Promise<PaymentResult> {
  const booking = await getBooking(ref);
  if (!booking) return "not_found";
  if (booking.status === "paid") return "paid";
  if (booking.status === "cancelled" || !booking.provider_order_id) return "failed";

  const order = await getOrder(ref);
  if (String(order.cf_order_id) !== booking.provider_order_id) return "failed";
  if (order.order_status === "ACTIVE") return "pending";
  if (order.order_status !== "PAID") return "failed";

  // The amount paid must match the total the server calculated.
  if (Math.round(Number(order.order_amount) * 100) !== booking.total * 100) {
    console.error("Amount mismatch for", ref);
    return "failed";
  }

  const paymentId = (await getPaidPaymentId(ref).catch(() => null)) ?? `order_${order.cf_order_id}`;
  const result = await markPaid(ref, String(order.cf_order_id), paymentId);
  // Keep only what's needed to reconcile; no guest contact details.
  await logPaymentEvent({
    ref,
    event: "PAID",
    orderId: String(order.cf_order_id),
    paymentId,
    amountPaise: booking.total * 100,
    raw: JSON.stringify({ order_id: ref, cf_order_id: order.cf_order_id, payment_id: paymentId, amount: order.order_amount, result }),
  }).catch(() => {});
  return result === "paid" ? "paid" : result === "needs_review" ? "needs_review" : "failed";
}
