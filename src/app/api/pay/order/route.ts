import { NextResponse } from "next/server";
import { quote } from "@/lib/pricing";
import { getRoom } from "@/lib/rooms";
import { earliestCheckIn } from "@/lib/dates";
import { bookingRef, isCheckoutRequest } from "@/lib/booking-schema";
import { cashfreeConfigured, cashfreeEnv, createOrder } from "@/lib/cashfree-server";
import { d1Configured } from "@/lib/d1";
import { piiConfigured } from "@/lib/pii";
import { attachOrder, cancelBooking, createPendingBooking } from "@/lib/bookings";
import { site } from "@/lib/site";

/**
 * Starts a payment: recalculates the price on the server (the amount shown in the
 * browser is never trusted), holds the dates, and creates a Cashfree order for the FULL amount.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!isCheckoutRequest(body)) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  if (body.checkIn < earliestCheckIn()) {
    return NextResponse.json({ error: "Bookings start from tomorrow. Please choose a later check-in date." }, { status: 400 });
  }

  const q = quote({
    roomSlug: body.room,
    plan: body.plan,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    adults: body.adults,
    children: body.children,
    addOns: body.addOns,
    coupon: body.coupon,
  });
  if (!q.ok) return NextResponse.json({ error: q.error }, { status: 400 });

  const ref = bookingRef();
  const room = getRoom(body.room)!;

  // Demo mode (no Cashfree keys): nothing is saved and no money moves.
  if (!cashfreeConfigured()) {
    return NextResponse.json({ mode: "mock", ref, orderId: `order_mock_${ref}`, amount: q.total });
  }

  // Live payments must never run without the database and encryption key,
  // or a paid stay could go unrecorded or guest data could be stored unprotected.
  if (!d1Configured() || !piiConfigured()) {
    console.error("Cashfree is live but the database or PII_ENCRYPTION_KEY is not configured.");
    return NextResponse.json({ error: "Online booking is temporarily unavailable. Please call us to book." }, { status: 503 });
  }

  // Hold the dates (atomic availability check + insert) before taking payment.
  try {
    const held = await createPendingBooking(ref, body, q.total);
    if (!held) return NextResponse.json({ error: "Sorry, those dates were just taken. Please choose different dates." }, { status: 409 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "We couldn't reserve your dates. Please try again in a moment." }, { status: 502 });
  }

  try {
    const email = body.guest.email?.trim();
    const order = await createOrder({
      orderId: ref,
      amountRupees: q.total,
      customer: {
        id: `guest_${ref.replace(/[^A-Za-z0-9]/g, "")}`,
        phone: body.guest.phone,
        name: body.guest.name.trim().slice(0, 100),
        email: email && /^\S+@\S+\.\S+$/.test(email) ? email : undefined,
      },
      // Cashfree needs an https return address; the modal flow works without one (local testing).
      returnUrl: site.url.startsWith("https://") ? `${site.url}/book/return?ref=${ref}` : undefined,
      expiresInMinutes: 16, // shorter than the 25-minute date hold, so no payment can land after the hold ends
      note: `${room.name}, ${body.checkIn} to ${body.checkOut}`,
    });
    if (!order.payment_session_id) throw new Error("Cashfree returned no payment session");
    await attachOrder(ref, String(order.cf_order_id));
    return NextResponse.json({ mode: "live", ref, paymentSessionId: order.payment_session_id, env: cashfreeEnv(), amount: q.total });
  } catch (err) {
    console.error(err);
    await cancelBooking(ref).catch(() => {});
    return NextResponse.json({ error: "We couldn't start the payment. Please try again in a moment." }, { status: 502 });
  }
}
